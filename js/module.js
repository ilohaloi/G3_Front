export async function loadHtml(id, url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.text();
            document.getElementById(id).innerHTML = data;
            // 加載成功後隱藏 preloader
            if (id === 'preloader-container') {
                document.getElementById(id).style.display = 'none';
            }
        } else {
            console.error(`Error loading ${url}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching the HTML:', error);
    }    
}
