const numberFormats = {
  en: {
    currency: { style: "currency", currency: "USD" }
  },
  fr: {
    currency: { style: "currency", currency: "EUR" }
  },
  // ar: {
  //   currency: { style: "currency", currency: "EUR", currencyDisplay: "code" }
  // }
}

// in template : {{ $n("28.99", "currency") }}

export default numberFormats