let deleteIconCreated = false;
let dropdownCreated = false;
let res = [];
let array10 = [];
let value;
let textarea = document.getElementById("searchInputId");

/**
 * 1. Xử lý sự kiện "keydown" trên bàn phím bên trong thẻ textarea. 
 * - Handle the keyboard "keydown" event inside the textarea tag.
 * 2. Kiểm soát sự thay đổi trạng thái "input" trong thẻ textarea. 
 * - Controls the "input" state change in the textarea tag.
 * @callback textarea
 */

/**
 * Hàm gọi lấy dữ liệu từ server
 * - The calling function gets data from the server
 * @date 4/6/2024 - 8:32:30 PM
 *
 * @async
 * @returns {unknown}
 */
async function fetchData() {
    try {
        const response = await fetch("https://backend-o94t.vercel.app/website/data");
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        return null;

    }
}

/**
 * Hàm xử lý dữ liệu từ server
 * - The function processes data from the server
 * @date 4/6/2024 - 8:30:26 PM
 *
 * @async
 * @returns {*}
 */
async function processData() {
    try {
        const data = await fetchData(); 

        if (data) {
            res = data; 
        } else {
            console.log("Không có dữ liệu được trả về");
        }

    } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu:", error);
    }
}

processData()

textarea.addEventListener("keydown", (event) => { 
    if (event.defaultPrevented) {
        return;
    }

    switch (event.key) {
        case "Escape":
            if(textarea.value == 0) {
                textarea.blur();
            }

            textarea.blur();

            if(dropdownCreated) {
                document.getElementById('list').style.display = 'none';
            }
            break;
        case "Enter":
            submit();
            break
        default:
            return; 
    }

    event.preventDefault();
}, true);

/**
 * Hàm tìm kiếm dữ liệu đầu vào và trả về true/false
 * - The function searches for input data and returns true/false
 * @date 4/6/2024 - 8:34:48 PM
 *
 * @param {string} url // Website's url
 * @param {string} value // input data from textarea
 * @returns {boolean}
 */
function searchUrl(url, value) {
    const escapedValue = value.replace(/\s/g, '').toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(escapedValue, 'g');

    const matches = url.replace(/\s/g, '').toLowerCase().match(regex);

    if(matches !== null) {
        return true;
    }

    return false;
}

textarea.addEventListener("input", async () => {
    array10 = []
    /**
     * Kiểm soát trạng thái ẩn/hiện
     * Control hide/show status
     */
    if (!deleteIconCreated) {
        const image = document.createElement("img");
        image.setAttribute("src", "./deleteIcon.png");
        image.setAttribute("class", "deleteIcon");
        image.setAttribute("id", "imgDeleteBtn");

        const deleteIcon = document.getElementById("main");
        deleteIcon.appendChild(image);
        
        deleteIconCreated = true;
    }

    if(!dropdownCreated) {
        const list = document.createElement('div');
        list.setAttribute("name", "list");
        list.setAttribute("id", "list");
        list.setAttribute("class", "list");
        
        const dropdown = document.getElementById("main");
        dropdown.appendChild(list);        
        
        document.getElementById('list').style.display = 'block';
        dropdownCreated = true;
    }
    
    value = textarea.value;
    
    for (let index = 0; index < res.length; index++) { // Duyệt phần tử có trong mảng được trả về từ server
                                                       // Loop through the elements in the array returned from the server
        const element = res[index];
        
        let found = searchUrl(element.url, value);
        
        if(found){ // Nếu đúng thì thực hiện thêm thẻ a vào HTML | If the result is correct, add the a tag to the HTML
            const a = document.createElement('a');
            
            if(a != null) {
                
                const valid = document.getElementById(element.id);
                if(!valid) {
                    a.setAttribute("href", element.url);
                    a.setAttribute("id", element.id);
                    
                    const alink = document.getElementById('list');
                    alink.appendChild(a);
                    
                    a.innerHTML = element.url;
                    
                    hasValue = true;
                    array10.push(element.id)
                } else {
                    array10.push(element.id)
                }
            }
        } else { // Nếu sai thì xóa những kết quả không đúng khỏi HTML | If false, remove the incorrect results from the HTML
            const div = document.getElementById("list");

            if(document.getElementById(element.id) !== null) {
                const alink = document.getElementById(element.id);
                div.removeChild(alink);
            }
        }
    }

    if(array10.length >= 10) {
        for (let index = 10; index < array10.length; index++) {
            const element = array10[index];
            if(!element) return;
            const div = document.getElementById("list");

            if(document.getElementById(element) !== null) {
                const alink = document.getElementById(element);
                div.removeChild(alink);
            }
        }
    }
    
    if(textarea.value == 0) {
        const parent = document.getElementById("main");
        const child = document.getElementById("imgDeleteBtn");
        const div = document.getElementById("list");

        parent.removeChild(child);
        parent.removeChild(div);
        
        deleteIconCreated = false;
        dropdownCreated = false;

        if(dropdownCreated) {
            document.getElementById('list').style.display = 'none';
        }
    }

    let img = document.getElementById("imgDeleteBtn")
    
    if (deleteIconCreated && dropdownCreated) {
    img.addEventListener("click", () => {
            const parent = document.getElementById("main");
            const child = document.getElementById("imgDeleteBtn");
            const div = document.getElementById("list");
            
            if(deleteIconCreated) {
                parent.removeChild(child);
            }

            if(dropdownCreated) {
                parent.removeChild(div);
                div.style.display = 'none';
            }
            
            deleteIconCreated = false;
            dropdownCreated = false;

            textarea.value = ""
        })
    }
});

/**
 * Xử lý sự kiện nhấn phím trên bàn phím của window
 * - Handle key press events on the windows keyboard
 * @callback window
 */

window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented  || event.target.tagName === "TEXTAREA") {
        return; 
    }
  
    switch (event.key) {
        case "/":
            textarea.focus()
            break;
        default:
            return; 
    }

    event.preventDefault();
}, true);

function submit() {
    for (let index = 0; index < res.length; index++) {
        const element = res[index];
        const found = searchUrl(element.url, textarea.value);
        if(found) {
            textarea.value = element.url;
            if(element.name.toLowerCase() === textarea.value.toLowerCase() || element.url.toLowerCase() === textarea.value.toLowerCase()) {
                window.location.href = element.url;
            }
        }
    }
}