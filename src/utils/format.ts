export const formatCurrency = (amount: number, options?: { noSuffix?: boolean }) => {
	return new Intl.NumberFormat("vi-VN", options?.noSuffix ? undefined : { currency: "VND", style: "currency" }).format(amount);
};
