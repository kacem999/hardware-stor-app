<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    public function merge(Request $request){
        $request->validate([
            'localCart' => 'sometimes|array',
            'localCart.*.product_id' => 'required|exists:products,id',
            'localCart.*.quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $localCart = $request->input('localCart', []);

        foreach ($localCart as $localItem) {
            $cartItem = $user->cartItems()->where('product_id', $localItem['product_id'])->first();

            if ($cartItem) {
                // if item exists in DB, add quantities together 
                $cartItem->increment('quantity', $localItem['quantity']);
            } else {
                // if not, create it
                $user->cartItems()->create([
                    'product_id' => $localItem['product_id'],
                    'quantity' => $localItem['quantity'],
                ]);
            }
        }

        return $user->cartItems()->with('product')->get();
    }
    public function index()
    {
        // Eager load the product details for each cart items
        return Auth::user()->cartItems()->with('product')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // Logic to add an item to the cart
        $user = Auth::user();
        $productId = $request->product_id;
        $quantity = $request->quantity;

        // Check if the product is already in the cart   
        $cartItem = $user->cartItems()->where('product_id', $productId)->first();
        if ($cartItem) {
            $cartItem->increment('quantity', $quantity);

        }else {
            $cartItem = $user->cartItems()->create([
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return response()->json($cartItem->load('product'), 201);
    }

    public function update(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Auth::user()->cartItems()->where('product_id', $productId)->firstOrFail();
        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        return response()->json($cartItem->load('product'));
    }

    public function destroy($productId)
    {
        Auth::user()->cartItems()->where('product_id', $productId)->firstOrFail()->delete();

        //return a success response with no content
        return response()->json(null, 204);
    }
}
