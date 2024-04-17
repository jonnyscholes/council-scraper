import prisma from "../lib/prisma";

async function main() {
  const response = await Promise.all([
    prisma.source.upsert({
      where: { url: "https://www.ballarat.vic.gov.au/" },
      update: {},
      create: {
        name: "Ballarat City Council",
        url: "https://www.ballarat.vic.gov.au/",
      },
    }),
  ]);
  console.log(response);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
