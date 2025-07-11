<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request){
        $request->validate([
            'shipping_address_line_1' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()){
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        //use database transaction 
        $order = DB::transaction(function () use ($user, $cartItems, $request){
            // 1. Calculate total amount 
            $totalAmount = $cartItems->sum(function ($cartItem){
                return $cartItem->product->price * $cartItem->quantity;
            });

            // 2.create the order 
            $order = $user->orders()->create([
                'total_amount' => $totalAmount,
                'status' => 'pending', 
                'shipping_address_line_1' => $request->shipping_address_line_1,
                'city' => $request->city,
                'postal_code' => $request->postal_code,
            ]);

            // 3. Create order items
            foreach ($cartItems as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);
            }

            // 4. Clear the user cart
            $user->cartItems()->delete();

            return $order;
        });

        return response()->json($order->load('items.product'), 201 );
    }

    //     public function index()
    // {
    //     $orders = Auth::user()->orders()->with('orderItems.product')->latest()->get();
    //     return response()->json($orders);
    // }
}
