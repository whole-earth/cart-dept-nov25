import Image from "next/image";

export default function HomePage() {
  return (
    <div className="fixed inset-0 z-0">
      <Image
        src="/slapdash.jpg"
        alt="Cart"
        fill
        className="object-cover"
        priority
      />
      <div className="fixed bottom-4 left-4 text-white">
        <p className="text-sm">Photo: Rotterdam, 2024</p>
      </div>
    </div>
  );
}
