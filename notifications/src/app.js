function askNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
        return;
    }
    Notification.requestPermission().then((permission) => {
        notificationBtn.style.display =
            permission === "granted" ? "none" : "block";
    });
}

/**
 * Fonction qui affiche une notification
 * @param {string} title - Titre de la notification
 * @param {string} body - Contenu de la notification
 * @returns {void}
 */
function showNotification(title, body) {
    const img = "https://www.w3schools.com/howto/img_avatar.png";
    const notification = new Notification(title, {
        body: body,
        icon: img,
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const notificationBtn = document.getElementById("notifyBtn");
    notificationBtn.addEventListener("click", () => {
        askNotificationPermission();
        showNotification(
            "Lists of tasks",
            "Hello! This is a notification from a service worker."
        );
    });
});

/**
 * Fonction qui affiche une notification
 * @param {string} title - Titre de la notification
 * @param {string} body - Contenu de la notification
 * @returns {void}
 */
function notifyMe() {
    if (!("Notification" in window)) {
        alert("Ce navigateur ne prend pas en charge la notification de bureau");
    } else if (Notification.permission === "granted") {
        const notification = new Notification("Salut toi!");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                const notification = new Notification("Salut toi!");
            }
        });
    }
}
