"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

type Props = {
  product?: Product;
  onSaved: () => void;
  onCancel: () => void;
};

const input =
  "w-full rounded-lg border border-[#D8D3C7] bg-white px-3 py-2 text-sm text-[#151814] outline-none placeholder:text-[#77776F] focus:border-[#315B46]";
const label = "mb-1 block text-sm font-medium text-[#242620]";

export default function ProductForm({ product, onSaved, onCancel }: Props) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price / 100) : "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.image ?? null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onPick(f: File | null) {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : (product?.image ?? null));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const kobo = Math.round(parseFloat(price) * 100);
    if (!name.trim() || Number.isNaN(kobo) || kobo < 0) {
      return setError("Enter a valid name and price");
    }
    if (!product && !file) return setError("Please choose an image");

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("price", String(kobo));
    if (file) fd.append("image", file);

    setLoading(true);
    try {
      await api(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PATCH" : "POST",
        body: fd, // no Content-Type header, browser sets it
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={label}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={input}
        />
      </div>

      <div>
        <label className={label}>Price (₦)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={input}
        />
      </div>

      <div>
        <label className={label}>
          Image{" "}
          {product && <span className="text-[#77776F]">(optional)</span>}
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-[#77776F] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#173B2A] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#315B46]"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="mt-3 h-32 w-32 rounded-lg border border-[#DED9CE] object-cover"
          />
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#D8D3C7] px-4 py-2 text-sm font-medium transition hover:bg-[#E8E3D8]"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          className="rounded-lg bg-[#173B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#315B46] disabled:opacity-50"
        >
          {loading ? "Saving..." : product ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}