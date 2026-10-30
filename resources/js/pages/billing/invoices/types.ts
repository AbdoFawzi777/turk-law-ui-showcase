import type { PageProps } from '@inertiajs/core';

export type BillingId = number | string;
export type BillingAmount = number | string;

export interface InvoiceClient {
    id: BillingId;
    name: string;
    tax_rate?: BillingAmount;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
}

export interface InvoiceCase {
    id: BillingId;
    client_id: BillingId;
    case_id?: string | null;
    title: string;
}

export type InvoiceLineItem = {
    id?: BillingId | null;
    description: string;
    quantity: BillingAmount;
    rate: BillingAmount;
    amount: BillingAmount;
    type?: 'manual' | 'time' | 'expense';
    expense_date?: string | null;
    entry_date?: string | null;
};

export type InvoiceFormData = {
    client_id: string;
    case_id: string;
    invoice_date: string;
    due_date: string;
    tax_rate: number;
    tax_amount: number;
    notes: string;
    line_items: InvoiceLineItem[];
};

export interface InvoicePayment {
    id: BillingId;
    amount: BillingAmount;
    status: string;
    receipt_path?: string | null;
}

export interface InvoiceRecord {
    id: BillingId;
    invoice_number: string;
    client_id: BillingId;
    case_id: BillingId;
    invoice_date: string;
    due_date: string;
    tax_rate?: BillingAmount;
    tax_amount: BillingAmount;
    subtotal: BillingAmount;
    total_amount: BillingAmount;
    status: string;
    notes?: string | null;
    line_items?: InvoiceLineItem[] | null;
    client?: InvoiceClient | null;
    case?: InvoiceCase | null;
    payments?: InvoicePayment[];
    currency?: { code: string } | null;
}

export interface InvoiceCurrency {
    id: BillingId;
    code: string;
    symbol: string;
}

export interface InvoiceCreatePageProps extends PageProps {
    clients: InvoiceClient[];
    cases: InvoiceCase[];
    clientBillingInfo?: Record<string, { payment_terms?: string; currency?: string }>;
    currencies?: InvoiceCurrency[];
}

export interface InvoiceEditPageProps extends PageProps {
    clients: InvoiceClient[];
    cases: InvoiceCase[];
    invoice: InvoiceRecord;
}

export interface InvoiceDetailPageProps extends PageProps {
    invoice: InvoiceRecord;
    invoiceItems: InvoiceLineItem[];
    payments?: InvoicePayment[];
    companyProfile?: { name?: string; address?: string; phone?: string; email?: string };
    clientBillingInfo?: Record<string, { currency?: string }>;
    currencies?: InvoiceCurrency[];
}
