export const sendContactForm = (data: any) => {
    console.log("DATA : " ,data);
    return fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to send message");
        }
        return res.json();
      });
  };