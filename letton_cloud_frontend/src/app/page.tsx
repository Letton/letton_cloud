import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <section className="flex items-center justify-center min-h-[calc(100svh-100px)] mx-auto overflow-x-hidden relative">
        <div className="absolute -z-50 top-[10%] left-[50%] w-[450px] h-[350px] blur-3xl rotate-45 bg-white opacity-20 rounded-full" />
        <div className="absolute -z-50 top-[55%] left-[5%] sm:left-[25%] w-[350px] h-[150px] blur-3xl -rotate-12 bg-white opacity-20 rounded-full" />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] max-w-xl text-center mx-auto drop-shadow">
            Cloud Storage — Надёжное хранение ваших файлов
          </h1>
          <p className="text-md text-muted-foreground sm:text-xl text-center mx-auto max-w-[750px]">
            Добро пожаловать в современное облачное пространство! Храните,
            получайте доступ и делитесь вашими файлами в любое время и из любой
            точки мира — безопасно и удобно.
          </p>
          <ul className="text-md text-muted-foreground sm:text-lg mx-auto max-w-[750px] space-y-1">
            <li>
              <span className="font-semibold text-foreground">
                🔐 Безопасность на первом месте
              </span>{" "}
              — все данные зашифрованы и защищены от несанкционированного
              доступа.
            </li>
            <li>
              <span className="font-semibold text-foreground">
                ☁️ Мгновенный доступ
              </span>{" "}
              — получайте доступ к файлам с любых устройств и платформ.
            </li>
            <li>
              <span className="font-semibold text-foreground">
                📁 Удобное управление
              </span>{" "}
              — интуитивно понятный интерфейс.
            </li>
          </ul>
          <div className="mx-auto flex justify-center">
            <Button asChild className="font-bold">
              <Link href="/dashboard">
                <Cloud className="mr-2" />
                Начать пользоваться сейчас
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
