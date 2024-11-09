export function copyToClipboard(text: string, done: () => void): void {
    navigator.clipboard.writeText(text).then(() => {
        done();
        console.log('Text copied to clipboard'); 
    }).catch(err => {
         console.error('Failed to copy text: ', err); 
    });
}