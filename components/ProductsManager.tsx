"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/types/product";
import Modal from "./Modal";
import ProductForm from "./ProductForm";

type ModalState =
  | { type: "add" }
  | { type: "edit"; product: Product }
  | { type: "delete"; product: Product }
  | null;

export default function ProductsManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function close() {
    setModal(null);
    setDeleteError("");
  }

  function saved() {
    close();
    router.refresh(); // re-runs the server page, list updates
  }

  async function confirmDelete(p: Product) {
    setDeleting(true);
    setDeleteError("");
    try {
      await api(`/api/products/${p.id}`, { method: "DELETE" });
      saved();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleStock(p: Product) {
    const fd = new FormData();
    fd.append("inStock", String(!p.inStock));
    try {
      await api(`/api/products/${p.id}`, { method: "PATCH", body: fd });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not update stock");
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Products
          </h2>
          <p className="mt-1 text-sm text-[#77776F]">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>

        <button
          onClick={() => setModal({ type: "add" })}
          className="rounded-lg bg-[#173B2A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#315B46]"
        >
          + Add product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D8D3C7] bg-[#FAF8F2] px-6 py-16 text-center">
          <p className="text-sm text-[#77776F]">
            No products yet. Add your first one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl border border-[#DED9CE] bg-[#FAF8F2]"
            >
              <div className="overflow-hidden bg-[#E8E3D8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className={`aspect-square w-full object-cover ${p.inStock ? "" : "opacity-60 grayscale"}`}
                />
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="truncate text-sm font-medium text-[#242620]">
                  {p.name}
                </h3>
                <p className="mt-1 text-base font-bold text-[#173B2A]">
                  {formatNaira(p.price)}
                </p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.inStock ? "In stock" : "Out of stock"}
                  </span>

                  <button
                    onClick={() => toggleStock(p)}
                    className="rounded-lg border border-[#D8D3C7] px-2.5 py-1 text-xs font-medium transition hover:bg-[#E8E3D8]"
                  >
                    {p.inStock ? "Mark out of stock" : "Mark in stock"}
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setModal({ type: "edit", product: p })}
                    className="flex-1 rounded-lg border border-[#D8D3C7] py-1.5 text-sm font-medium transition hover:bg-[#E8E3D8]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setModal({ type: "delete", product: p })}
                    className="flex-1 rounded-lg border border-red-200 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal?.type === "add" && (
        <Modal title="Add product" onClose={close}>
          <ProductForm onSaved={saved} onCancel={close} />
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Edit product" onClose={close}>
          <ProductForm
            key={modal.product.id}
            product={modal.product}
            onSaved={saved}
            onCancel={close}
          />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="Delete product?" onClose={close}>
          <p className="text-sm text-[#77776F]">
            <b className="text-[#151814]">{modal.product.name}</b> and its image
            will be removed permanently.
          </p>
          {deleteError && (
            <p className="mt-2 text-sm text-red-600">{deleteError}</p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={close}
              className="rounded-lg border border-[#D8D3C7] px-4 py-2 text-sm font-medium transition hover:bg-[#E8E3D8]"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmDelete(modal.product)}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}