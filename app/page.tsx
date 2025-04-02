import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <header className="flex items-center justify-between p-4 bg-gray-200 text-white">
        {/* // Logo as Image */}
        <div className="flex items-center">
          <Image
            src="/driver-ed-logo.png"
            alt="Your Company Logo"
            width={100}
            height={50}
          />
        </div>
        {/* right div with oly login button */}
        <Button variant={"default"}>
          <Link href="/signin">Sign In</Link>
        </Button>
      </header>
    </div>
  );
}
