const calculateTotal = (req) => {
  const data = req.body;
  const total =
    Number(data.price) +
    Number(data.hospitality_fee) +
    Number(data.insurace_fee) +
    Number(data.legal_fee);

  return total;
};

// Validate Object
const checkIfEmpty = (obj, res) => {
  if (obj) {
    for (let key in obj) {
      if (obj[key] == "" || obj[key] == null || obj[key] == undefined) {
        return res.json(`${key} is not allowed to be empty`);
      }
    }
  }
};

module.exports = { calculateTotal, checkIfEmpty };
