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

        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback(){

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // find a user with the matching google_id
            $user = User::where('google_id', $googleUser->id)->first();

            if(!$user) {
                // if no user found, find or create one by email
                $user = User::firstOrCreate(
                    ['email' => $googleUser->email],
                    [
                        'name' => $googleUser->name,
                        'google_id' => $googleUser->id,
                        'password' => Hash::make(uniqid()) // Generate a random password
                    ]
                );
            }

            // Log the user in and create a token for our frontend
            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect('http://localhost:5173/auth/callback?token=' . $token);

        } catch (\Exception $e) {
            // redirect back to the frontend with an error message 
            return redirect('http://localhost:5173/login?error=google_login_failed');
        }
    }
}
