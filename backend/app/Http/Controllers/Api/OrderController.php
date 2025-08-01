<?php

namespace App\Http\Controllers\Api;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function store(Request $request){
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'wilaya' => 'required|string|max:255',
            'commune' => 'required|string|max:255',
            'address' => 'required|string|max:255',
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
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'wilaya' => $request->wilaya,
                'commune' => $request->commune,
                'address' => $request->address,

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

    public function index(){

        $orders = Order::with(['user','items.product'])->latest()->get();
        return response()->json($orders);
    }

    public function show(Order $order) {
        return $order->load(['user', 'items.product']);
    }

    public function update(Request $request , Order $order) {
        $request->validate([
            'status' => ['required', Rule::in(['pending', 'processing','shipped', 'delivered', 'cancelled'])],

        ]);

        $order->update(['status' => $request->status]);

        return response()->json($order->load(['user', 'items.product']));

    }
}
