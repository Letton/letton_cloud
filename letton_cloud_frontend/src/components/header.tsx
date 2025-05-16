"use client";

import { User } from "@/api/dto/auth.dto";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import useSWR from "swr";

const navItems = [
  { label: "Главная", link: "/" },
  { label: "Dashboard", link: "/dashboard" },
  { label: "FAQ", link: "/faq" },
];

import * as api from "@/api/index";
import { Cloud } from "lucide-react";

export default function Header() {
  const { data: user } = useSWR<User>("/users/me", async () => {
    return await api.auth.getMe();
  });

  return (
    <header className="container mx-auto px-4 py-8">
      <nav className="flex justify-between items-center">
        <div className="flex items-center space-x-16">
          <Link href="/">
            <h1 className="text-xl font-semibold py-1 flex gap-2 items-center">
              <Cloud />
              Cloud Storage
            </h1>
          </Link>
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <Link href={item.link} key={item.label}>
                <li>{item.label}</li>
              </Link>
            ))}
          </ul>
        </div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{user.username}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Мой аккаунт </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={"/account/profile"}>
                  <DropdownMenuItem>Профиль</DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuItem onClick={api.auth.logout}>
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth">Войти</Link>
        )}
      </nav>
    </header>
  );
}
