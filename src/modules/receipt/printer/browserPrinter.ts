export async function browserPrinter() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      window.print();
      resolve();
    });
  });
}