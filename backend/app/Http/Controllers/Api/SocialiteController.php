<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
class SocialiteController extends Controller
{
    public function redirectToGoogle(){
        // Use session-based OAuth since we've applied web middleware
        // Disable SSL verification for development
        $guzzle = new \GuzzleHttp\Client(['verify' => false]);
        return Socialite::driver('google')->setHttpClient($guzzle)->redirect();
    }

    public function handleGoogleCallback(Request $request){
        try {
            // Disable SSL verification for development
            $guzzle = new \GuzzleHttp\Client(['verify' => false]);
            $googleUser = Socialite::driver('google')->setHttpClient($guzzle)->user();

            // find a user with the matching google_id
            $user = User::where('google_id', $googleUser->id)->first();

            if(!$user) {
                $user = User::where('email', $googleUser->email)->first();
                
                // If user exists by email but doesn't have google_id, update their record
                if($user) {
                    $user->update([
                        'google_id' => $googleUser->id
                    ]);
                } else {
                    // No user exists with this email, create a new one
                    $user = User::create([
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'password' => Hash::make(uniqid()) // Generate a random password
                    ]);
                }
            }   

            // Log the user in and create a token for our frontend
            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect('http://localhost:5173/auth/callback?token=' . $token);

        } catch (\Exception $e) {
            // Log the actual exception for debugging
            \Log::error('Google login failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Check if this is a session error
            if (strpos($e->getMessage(), 'Session store not set') !== false) {
                // Add web middleware to enable sessions
                // For testing/debugging purposes, let's try something different
                return redirect('http://localhost:5173/login?error=session_error&message=' . urlencode('Session error: ' . $e->getMessage()));
            }
            
            // redirect back to the frontend with an error message 
            return redirect('http://localhost:5173/login?error=google_login_failed&message=' . urlencode($e->getMessage()));
        }
    }
}
