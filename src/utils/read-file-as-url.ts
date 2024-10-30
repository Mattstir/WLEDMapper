export async function readFileAsUrl(file: Blob): Promise<string | undefined> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target?.result as any);
        };
        reader.readAsDataURL(file);
    });
}