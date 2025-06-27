<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Str;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with('category')->get();
    }

    public function show(Product $product)
    {
        return $product->load('category');

    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->price,
            'stock_quantity' => $request->stok_quantity,
            'price' => $request->price,
            'category_id' => $request->category_id,
        ]);

        return response()->json($product->load('category'), 201);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'stock_quantity' => $request->stok_quantity,
            'price' => $request->price,
            'category_id' => $request->category_id,
        ]);

        return response()->json($product->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
}
