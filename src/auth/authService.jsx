export async function login(email, password) {
  // Simulation d’un appel API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "test@test.com" && password === "123456") {
        resolve({
          token: "fake-jwt-token",
          user: { id: 1, email }
        });
      } else {
        reject(new Error("Email ou mot de passe incorrect"));
      }
    }, 500);
  });
}