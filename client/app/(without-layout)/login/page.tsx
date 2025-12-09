import LoginForm from "@/components/form/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import Logo from "@/public/sust.png";

export const metadata = {
  title: "Login",
  description: "Login to access the Campus CCTV Monitoring System",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center  mb-4">
            <Image src={Logo} alt="Logo" width={80} height={80} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            SUST Campus CCTV
          </h1>
          <p className="text-muted-foreground mt-2">
            Security Monitoring System
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
