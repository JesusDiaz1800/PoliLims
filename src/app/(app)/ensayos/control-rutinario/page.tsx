import { ControlRutinarioClient } from "@/components/ensayos/control-rutinario-client";
import { getProductsFromSap } from "@/services/sap-service";
import { getMatrizProductos } from "@/lib/matriz-datos";

export default function ControlRutinarioPage() {
  // Data is fetched on the server and passed down to the client component.
  const sapProducts = getProductsFromSap();
  const productMatrix = getMatrizProductos();

  return (
    <div className="space-y-6">
      <ControlRutinarioClient 
        sapProducts={sapProducts}
        productMatrix={productMatrix}
      />
    </div>
  );
}
