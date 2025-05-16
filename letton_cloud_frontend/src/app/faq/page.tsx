import Header from "@/components/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function FAQPage() {
  return (
    <>
      <Header />
      <section className="flex items-center justify-center min-h-[calc(100svh-100px)] container mx-auto overflow-x-hidden relative">
        <div className="w-full max-w-xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Что нужно для того, чтобы начать пользоваться сервисом?
              </AccordionTrigger>
              <AccordionContent>
                Ничего лишнего - потребуется только завести аккаунт.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Где хранятся мои файлы?</AccordionTrigger>
              <AccordionContent>
                Ваши файлы хранятся в S3 Object Storage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                На каком фреймворке построен сервис?
              </AccordionTrigger>
              <AccordionContent>
                Облачное хранилище разработано на Nest.Js и Next.js.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Какова табильность работы?</AccordionTrigger>
              <AccordionContent>
                Сервис обладает высокой стабильностью и скоростью работы
                благодаря использованию микросервисной архитектуры.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
