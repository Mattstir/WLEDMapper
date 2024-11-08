export function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => { 
        console.log('Text copied to clipboard'); 
    }).catch(err => {
         console.error('Failed to copy text: ', err); 
    });
}