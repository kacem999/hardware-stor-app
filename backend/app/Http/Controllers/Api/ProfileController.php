<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function myOrders() {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $orders = $user->orders()->with('items.product')->latest()->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Error fetching user orders: ' . $e->getMessage());
            
            // Return a friendly error message
            return response()->json(['error' => 'Failed to fetch orders. Please try again later.'], 500);
        }
    }
}
