
document.getElementById("contributeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const token = document.getElementById("token").value;
  const amount = document.getElementById("amount").value;
  alert(`Contribution of ${amount} ${token} submitted.`);
});
