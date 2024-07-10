import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Bookmark, Heart } from "lucide-react";

export default async function Home() {
  return (
    <>
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-foreground-400">
          Weekly Popular Personas
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 md:gap-8 md:grid-cols-3">
          <Card
            isFooterBlurred
            className="h-[400px] dark:bg-default-100/60"
            isBlurred
          >
            <CardHeader className="block">
              <h6 className="text-large font-medium text-foreground-600">
                Alice Cooper
              </h6>

              <p className="text-foreground-500">
                Police officer from South Atlanta
              </p>

              <p className="text-foreground-500 text-small">
                Charismatic, creative
              </p>
            </CardHeader>

            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover object-center"
              src="https://images.unsplash.com/photo-1550703703-c6f229024ba9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />

            <CardFooter className="justify-between overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <div className="text-foreground-700 text-small">by FroggyMan</div>
              <div className="flex items-center gap-2">
                <Button
                  color="danger"
                  variant="light"
                  endContent={<Heart size={16} className="ml-2" />}
                >
                  12
                </Button>
                <Button isIconOnly variant="light">
                  <Bookmark size={16} />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card
            isFooterBlurred
            className="h-[400px] dark:bg-default-100/60"
            isBlurred
          >
            <CardHeader className="block">
              <h6 className="text-large font-medium text-foreground-600">
                baekhyun
              </h6>

              <p className="text-foreground-500">K-pop star from Seoul</p>

              <p className="text-foreground-500 text-small">
                Charismatic, creative
              </p>
            </CardHeader>

            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover object-center"
              src="https://upload.wikimedia.org/wikipedia/commons/0/02/%ED%95%98%EC%96%80%EB%A8%B8%EB%A6%AC_%EB%B0%B1%ED%98%84_3.jpg"
            />

            <CardFooter className="justify-between overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <div className="text-foreground-700 text-small">by FroggyMan</div>
              <div className="flex items-center gap-2">
                <Button
                  color="danger"
                  variant="light"
                  endContent={<Heart size={16} className="ml-2" />}
                >
                  452
                </Button>
                <Button isIconOnly variant="light">
                  <Bookmark size={16} />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card
            isFooterBlurred
            className="h-[400px] dark:bg-default-100/60"
            isBlurred
          >
            <CardHeader className="block">
              <h6 className="text-large font-medium text-foreground-600">
                Kim Possible
              </h6>

              <p className="text-foreground-500">
                Police officer from South Atlanta
              </p>

              <p className="text-foreground-500 text-small">
                Charismatic, creative
              </p>
            </CardHeader>

            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover object-center"
              src="https://www.looper.com/img/gallery/things-only-adults-notice-in-kim-possible/intro-1632408403.jpg"
            />

            <CardFooter className="justify-between overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <div className="text-foreground-700 text-small">by FroggyMan</div>
              <div className="flex items-center gap-2">
                <Button
                  color="danger"
                  variant="light"
                  endContent={<Heart size={16} className="ml-2" />}
                >
                  47
                </Button>
                <Button isIconOnly variant="light">
                  <Bookmark size={16} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
