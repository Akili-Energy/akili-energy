import Image from "next/image"

export function AkiliLogo() {
  return (
    <Image
      src="/images/akili-logo.png"
      alt="Akili Energy Logo"
      width={64}
      height={64}
      className="w-8 h-8"
    />
  );
}
