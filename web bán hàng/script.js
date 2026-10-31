let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add("active");
    }
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

if (slides.length > 0) {
    setInterval(nextSlide, 4000);
}

const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
if (prevBtn) prevBtn.addEventListener("click", prevSlide);
if (nextBtn) nextBtn.addEventListener("click", nextSlide);

dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
        currentSlide = idx;
        showSlide(currentSlide);
    });
});

const loadMoreBtns = document.querySelectorAll(".btn-load-more");
loadMoreBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        const targetId = this.getAttribute("data-target");
        const section = document.getElementById(targetId);
        if (section) {
            const hiddenCards = section.querySelectorAll(".product-card.is-hidden, .product-card.is-expanded");
            
            let isExpanded = this.classList.contains("expanded");

            if (!isExpanded) {
                hiddenCards.forEach(card => {
                    card.classList.remove("is-hidden");
                    card.classList.add("is-expanded");
                });
                this.classList.add("expanded");
                this.innerHTML = 'RÚT GỌN <i class="fa-solid fa-chevron-up"></i>';
            } else {
                hiddenCards.forEach(card => {
                    card.classList.add("is-hidden");
                    card.classList.remove("is-expanded");
                });
                this.classList.remove("expanded");
                this.innerHTML = 'LOAD MORE <i class="fa-solid fa-chevron-down"></i>';
            }
        }
    });
});

let cart = [];

const cartModal = document.getElementById("cart-modal");
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const emptyCartMsg = document.getElementById("empty-cart-msg");

function parsePrice(priceString) {
    return parseInt(priceString.replace(/[^0-9]/g, "")) || 0;
}

function formatPrice(number) {
    return number.toLocaleString("vi-VN") + " VNĐ";
}

function updateCartUI() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalCount = 0;

    if (cart.length === 0) {
        if (emptyCartMsg) emptyCartMsg.style.display = "block";
    } else {
        if (emptyCartMsg) emptyCartMsg.style.display = "none";
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalCount += item.quantity;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${formatPrice(item.price)}</td>
                <td>
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span style="margin: 0 8px;">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </td>
                <td>${formatPrice(itemTotal)}</td>
                <td><button class="remove-btn" onclick="removeItem(${index})">&times;</button></td>
            `;
            cartItemsContainer.appendChild(tr);
        });
    }

    if (cartTotalPrice) cartTotalPrice.innerText = formatPrice(total);
    if (cartBtn) {
        cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Giỏ hàng (${totalCount})`;
    }
}

function addToCart(name, priceStr) {
    const price = parsePrice(priceStr);
    if (!price || !name) return;

    const existingIndex = cart.findIndex(item => item.name === name);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }

    updateCartUI();
}

function changeQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    }
}

function removeItem(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        updateCartUI();
    }
}

document.addEventListener("click", function(e) {
    const addBtn = e.target.closest(".btn-add");
    if (addBtn) {
        const card = addBtn.closest(".product-card");
        if (card) {
            const nameEl = card.querySelector("h3");
            const priceEl = card.querySelector(".price");

            if (nameEl && priceEl) {
                const name = nameEl.innerText.trim();
                const priceStr = priceEl.innerText.trim();
                addToCart(name, priceStr);
            }
        }
    }
});

if (cartBtn) {
    cartBtn.addEventListener("click", function() {
        if (cartModal) cartModal.classList.add("active");
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener("click", function() {
        if (cartModal) cartModal.classList.remove("active");
    });
}

window.addEventListener("click", function(e) {
    if (e.target === cartModal) {
        cartModal.classList.remove("active");
    }
});
const productModal = document.getElementById("product-modal");
const closeProductModal = document.querySelector(".close-product-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalAddBtn = document.querySelector(".modal-add-btn");
const modalDesc = document.querySelector(".modal-desc");

document.addEventListener("click", function(e) {
    const card = e.target.closest(".product-card");
    
    if (card && !e.target.closest(".btn-add")) {
        const imgEl = card.querySelector(".img-box img");
        const nameEl = card.querySelector("h3");
        const priceEl = card.querySelector(".price");

        const brand = card.getAttribute("data-brand") || "Chính hãng";
        const scale = card.getAttribute("data-scale") || "1/12";
        const material = card.getAttribute("data-material") || "PVC, ABS";
        const release = card.getAttribute("data-release") || "Đang cập nhật";

        if (imgEl && nameEl && priceEl) {
            modalImg.src = imgEl.src;
            modalTitle.innerText = nameEl.innerText;
            modalPrice.innerText = priceEl.innerText;

            if (modalDesc) {
                modalDesc.innerHTML = `
                    <p><strong>Thương hiệu:</strong> ${brand}</p>
                    <p><strong>Tỷ lệ:</strong> ${scale}</p>
                    <p><strong>Chất liệu:</strong> ${material}</p>
                    <p><strong>Thời gian phát hành:</strong> ${release}</p>
                `;
            }

            if (productModal) {
                productModal.classList.add("active");
            }
        }
    }
});

if (closeProductModal) {
    closeProductModal.addEventListener("click", function() {
        productModal.classList.remove("active");
    });
}

window.addEventListener("click", function(e) {
    if (e.target === productModal) {
        productModal.classList.remove("active");
    }
});

if (modalAddBtn) {
    modalAddBtn.addEventListener("click", function() {
        const name = modalTitle.innerText;
        const priceStr = modalPrice.innerText;
        addToCart(name, priceStr);
        productModal.classList.remove("active");
    });
}
const navLinks = document.querySelectorAll(".nav-links a");

// Tự động nhận diện trang hiện tại để làm sáng menu tương ứng khi vừa vào trang
navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === window.location.pathname.split("/").pop() || 
        (window.location.pathname.endsWith("/") && link.getAttribute("href") === "index.html")) {
        link.classList.add("active");
    }
});

// Xử lý khi người dùng click vào từng mục trên menu
navLinks.forEach(link => {
    link.addEventListener("click", function() {
        navLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});
// Xử lý sự kiện khi bấm nút Thanh toán trong giỏ hàng
const checkoutBtn = document.querySelector(".checkout-btn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        
        // Chuyển hướng người dùng sang trang contact.html để xem thông tin chuyển khoản STK
        window.location.href = "contact.html";
    });
}