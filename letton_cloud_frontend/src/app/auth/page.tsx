import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  return (
    <>
      <main>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <Tabs defaultValue="sign_in">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sign_in">Войти</TabsTrigger>
                <TabsTrigger value="sign_up">Зарегистрироваться</TabsTrigger>
              </TabsList>
              <TabsContent value="sign_in">
                <LoginForm />
              </TabsContent>
              <TabsContent value="sign_up">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
}
