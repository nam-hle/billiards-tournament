import React from "react";
import type { Metadata } from "next";

import { BankAccountForm } from "@/components/forms/bank-account-form";

export const metadata: Metadata = {
	title: "New Bank Account"
};

export default async function NewBankAccount() {
	return <BankAccountForm />;
}
