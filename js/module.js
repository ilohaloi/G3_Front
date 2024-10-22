export async function loadHtml(id, url) {
    try {
        const response = await fetch(url)
        if (response.ok) {
            const data = await response.text();
            document.getElementById(id).innerHTML = data;
        }
    } catch (error) {
        console.log(error);
    }    
}