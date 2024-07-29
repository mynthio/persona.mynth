"use client";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";

type PersonaCardHeaderProps = {
  chips: PersonaCardHeaderChip[];
};

export function PersonaCardHeader({ chips }: PersonaCardHeaderProps) {
  return (
    <CardHeader className="absolute z-10 top-0 left-0 right-0 flex-col pb-6 !items-start rounded-none">
      <div className="flex items-center gap-1 text-foreground-700 text-small">
        {chips.map((chip, index) => (
          <Chip
            key={index}
            className={cn(
              "bg-default-50/40 backdrop-blur-sm",
              chip.icon && chip.label && "pl-2"
            )}
            variant="light"
            startContent={chip.label ? chip.icon : null}
          >
            {chip.label || chip.icon}
          </Chip>
        ))}
      </div>
    </CardHeader>
  );
}

type PersonaCardFooterProps = {
  className?: string;
  children: React.ReactNode;
};

export function PersonaCardFooter({
  className,
  children,
}: PersonaCardFooterProps) {
  return (
    <CardFooter
      className={cn(
        "justify-between overflow-hidden px-0 py-0.5 absolute rounded-large bottom-1 w-[calc(100%_-_32px)] shadow-small ml-4 z-10",
        className
      )}
    >
      {children}
    </CardFooter>
  );
}

type PersonaCardHeaderChip = {
  label?: String;
  icon?: React.ReactNode;
};

export type PersonaCardBackgroundImageProps = {
  alt: string;
  imageSrc: string;
};

export function PersonaCardBackgroundImage({
  alt,
  imageSrc,
}: PersonaCardBackgroundImageProps) {
  return (
    <>
      <Image
        removeWrapper
        loading="lazy"
        alt={alt}
        className="z-0 w-full h-full object-cover"
        src={imageSrc}
      />
      <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
    </>
  );
}

export type PersonaCardTitleProps = {
  title: string;
  href: string;
  subtitle?: string;
};

export function PersonaCardTitle({
  title,
  subtitle,
  href,
}: PersonaCardTitleProps) {
  return (
    <>
      <Link
        href={href}
        className="text-white font-medium text-2xl w-full overflow-hidden truncate whitespace-nowrap"
      >
        {title}
      </Link>
      {subtitle && (
        <p className="text-small text-white/60 overflow-hidden whitespace-break-spaces mt-1 line-clamp-2 w-full">
          {subtitle}
        </p>
      )}
    </>
  );
}

export type PersonaCardBodyProps = {
  className?: string;
  children: React.ReactNode;
};

export function PersonaCardBody({ className, children }: PersonaCardBodyProps) {
  return (
    <CardBody
      className={cn(
        "absolute bg-transparent bottom-5 m-0 left-0 right-0 md:p-6 w-auto rounded-t-xl z-10 flex-col h-32",
        className
      )}
    >
      {children}
    </CardBody>
  );
}

type PersonaCardProps = {
  className?: string;
  children: React.ReactNode;
};

export function PersonaCard({ className, children }: PersonaCardProps) {
  return (
    <Card
      className={cn("h-[400px] overflow-hidden", className)}
      isFooterBlurred
    >
      {children}
    </Card>
  );
}
