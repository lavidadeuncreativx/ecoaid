// --- 13. FAQ ACCORDION LOGIC ---
const detailsElements = document.querySelectorAll("details");

detailsElements.forEach((targetDetail) => {
    targetDetail.addEventListener("click", (e) => {
        // Only prevent default if clicking the summary
        if (e.target.closest("summary")) {
            e.preventDefault();

            // Check if it's currently open
            const isOpen = targetDetail.hasAttribute("open");

            // Close all other details
            detailsElements.forEach((detail) => {
                if (detail !== targetDetail && detail.hasAttribute("open")) {
                    // Animate closing
                    const content = detail.querySelector("div");
                    gsap.to(content, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.inOut",
                        onComplete: () => {
                            detail.removeAttribute("open");
                            gsap.set(content, { height: "auto", opacity: 1 }); // Reset for next open
                        }
                    });
                    // Rotate icon back
                    const icon = detail.querySelector(".expand-icon");
                    if (icon) gsap.to(icon, { rotation: 0, duration: 0.3 });
                }
            });

            if (!isOpen) {
                // OPENING
                targetDetail.setAttribute("open", "");
                const content = targetDetail.querySelector("div");
                const icon = targetDetail.querySelector(".expand-icon");

                // Animate from 0 to auto
                gsap.fromTo(content,
                    { height: 0, opacity: 0 },
                    { height: "auto", opacity: 1, duration: 0.3, ease: "power2.inOut" }
                );

                // Rotate icon
                if (icon) gsap.to(icon, { rotation: 180, duration: 0.3 });

            } else {
                // CLOSING (if clicking the already open one)
                const content = targetDetail.querySelector("div");
                const icon = targetDetail.querySelector(".expand-icon");

                gsap.to(content, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => {
                        targetDetail.removeAttribute("open");
                        gsap.set(content, { height: "auto", opacity: 1 });
                    }
                });

                if (icon) gsap.to(icon, { rotation: 0, duration: 0.3 });
            }
        }
    });
});
