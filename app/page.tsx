import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center space-y-8 p-8">
        <div className="flex items-center justify-center space-x-4">
          <Car className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold">Car Management System</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-md">
          Manage your car inventory with ease. Upload images, add details, and keep track of your vehicles.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}