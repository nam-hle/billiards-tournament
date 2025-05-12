export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Views: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		Tables: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Returns: Json;
				Args: {
					query?: string;
					variables?: Json;
					extensions?: Json;
					operationName?: string;
				};
			};
		};
	};
	public: {
		CompositeTypes: {
			[_ in never]: never;
		};
		Functions: {
			get_filtered_bills: {
				Returns: {
					id: string;
					total_count: number;
				}[];
				Args: {
					group: string;
					member: string;
					debtor?: string;
					creator?: string;
					page_size: number;
					creditor?: string;
					page_number: number;
					text_search?: string;
					since_timestamp?: string;
				};
			};
		};
		Enums: {
			BankAccountType: "Bank" | "Wallet";
			BillMemberRole: "Creditor" | "Debtor";
			BankAccountStatus: "Active" | "Inactive";
			TransactionStatus: "Waiting" | "Confirmed" | "Declined";
			MembershipStatus: "Idle" | "Active" | "Requesting" | "Inviting";
			NotificationType: "BillCreated" | "BillUpdated" | "BillDeleted" | "TransactionWaiting" | "TransactionConfirmed" | "TransactionDeclined";
		};
		Views: {
			user_financial_summary: {
				Row: {
					owed: number | null;
					paid: number | null;
					sent: number | null;
					balance: number | null;
					user_id: string | null;
					group_id: string | null;
					received: number | null;
				};
				Relationships: [
					{
						isOneToOne: false;
						columns: ["group_id"];
						referencedColumns: ["id"];
						referencedRelation: "groups";
						foreignKeyName: "users_groups_group_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["user_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "users_groups_user_id_fkey";
					}
				];
			};
		};
		Tables: {
			groups: {
				Relationships: [];
				Row: {
					id: string;
					name: string;
					created_at: string;
					display_id: string;
				};
				Insert: {
					id?: string;
					name: string;
					display_id: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					created_at?: string;
					display_id?: string;
				};
			};
			profiles: {
				Row: {
					id: string;
					username: string;
					full_name: string;
					website: string | null;
					updated_at: string | null;
					avatar_file: string | null;
					selected_group_id: string | null;
				};
				Insert: {
					id: string;
					username?: string;
					full_name?: string;
					website?: string | null;
					updated_at?: string | null;
					avatar_file?: string | null;
					selected_group_id?: string | null;
				};
				Update: {
					id?: string;
					username?: string;
					full_name?: string;
					website?: string | null;
					updated_at?: string | null;
					avatar_file?: string | null;
					selected_group_id?: string | null;
				};
				Relationships: [
					{
						isOneToOne: false;
						referencedColumns: ["id"];
						referencedRelation: "groups";
						columns: ["selected_group_id"];
						foreignKeyName: "profiles_selected_group_id_fkey";
					}
				];
			};
			bill_debtors: {
				Row: {
					id: string;
					amount: number;
					bill_id: string;
					user_id: string;
					role: Database["public"]["Enums"]["BillMemberRole"];
				};
				Insert: {
					id?: string;
					amount: number;
					user_id: string;
					bill_id?: string;
					role?: Database["public"]["Enums"]["BillMemberRole"];
				};
				Update: {
					id?: string;
					amount?: number;
					bill_id?: string;
					user_id?: string;
					role?: Database["public"]["Enums"]["BillMemberRole"];
				};
				Relationships: [
					{
						isOneToOne: false;
						columns: ["bill_id"];
						referencedColumns: ["id"];
						referencedRelation: "bills";
						foreignKeyName: "bill_members_bill_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["user_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "bill_members_user_id_fkey";
					}
				];
			};
			memberships: {
				Row: {
					id: string;
					user_id: string;
					group_id: string;
					created_at: string;
					status: Database["public"]["Enums"]["MembershipStatus"];
				};
				Insert: {
					id?: string;
					user_id: string;
					group_id: string;
					created_at?: string;
					status?: Database["public"]["Enums"]["MembershipStatus"];
				};
				Update: {
					id?: string;
					user_id?: string;
					group_id?: string;
					created_at?: string;
					status?: Database["public"]["Enums"]["MembershipStatus"];
				};
				Relationships: [
					{
						isOneToOne: false;
						columns: ["group_id"];
						referencedColumns: ["id"];
						referencedRelation: "groups";
						foreignKeyName: "users_groups_group_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["user_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "users_groups_user_id_fkey";
					}
				];
			};
			bank_accounts: {
				Relationships: [
					{
						isOneToOne: false;
						columns: ["user_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "bank_accounts_user_id_fkey";
					}
				];
				Row: {
					id: string;
					user_id: string;
					created_at: string;
					is_default: boolean;
					account_holder: string;
					account_number: string;
					provider_number: string;
					type: Database["public"]["Enums"]["BankAccountType"];
					status: Database["public"]["Enums"]["BankAccountStatus"];
				};
				Insert: {
					id?: string;
					user_id: string;
					created_at?: string;
					is_default?: boolean;
					account_holder: string;
					account_number: string;
					provider_number: string;
					type?: Database["public"]["Enums"]["BankAccountType"];
					status?: Database["public"]["Enums"]["BankAccountStatus"];
				};
				Update: {
					id?: string;
					user_id?: string;
					created_at?: string;
					is_default?: boolean;
					account_holder?: string;
					account_number?: string;
					provider_number?: string;
					type?: Database["public"]["Enums"]["BankAccountType"];
					status?: Database["public"]["Enums"]["BankAccountStatus"];
				};
			};
			transactions: {
				Row: {
					id: string;
					amount: number;
					group_id: string;
					issued_at: string;
					sender_id: string;
					created_at: string;
					display_id: string;
					receiver_id: string;
					bank_account_id: string | null;
					status: Database["public"]["Enums"]["TransactionStatus"];
				};
				Insert: {
					id?: string;
					amount: number;
					group_id: string;
					issued_at: string;
					sender_id: string;
					display_id: string;
					created_at?: string;
					receiver_id: string;
					bank_account_id?: string | null;
					status?: Database["public"]["Enums"]["TransactionStatus"];
				};
				Update: {
					id?: string;
					amount?: number;
					group_id?: string;
					issued_at?: string;
					sender_id?: string;
					created_at?: string;
					display_id?: string;
					receiver_id?: string;
					bank_account_id?: string | null;
					status?: Database["public"]["Enums"]["TransactionStatus"];
				};
				Relationships: [
					{
						isOneToOne: false;
						referencedColumns: ["id"];
						columns: ["bank_account_id"];
						referencedRelation: "bank_accounts";
						foreignKeyName: "transactions_bank_account_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["group_id"];
						referencedColumns: ["id"];
						referencedRelation: "groups";
						foreignKeyName: "transactions_group_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["receiver_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "transactions_receiver_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["sender_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "transactions_sender_id_fkey";
					}
				];
			};
			notifications: {
				Row: {
					id: string;
					user_id: string;
					created_at: string;
					trigger_id: string;
					read_status: boolean;
					metadata: Json | null;
					bill_display_id: string | null;
					transaction_display_id: string | null;
					type: Database["public"]["Enums"]["NotificationType"];
				};
				Insert: {
					id?: string;
					user_id?: string;
					trigger_id: string;
					created_at?: string;
					read_status?: boolean;
					metadata?: Json | null;
					bill_display_id?: string | null;
					transaction_display_id?: string | null;
					type: Database["public"]["Enums"]["NotificationType"];
				};
				Update: {
					id?: string;
					user_id?: string;
					created_at?: string;
					trigger_id?: string;
					read_status?: boolean;
					metadata?: Json | null;
					bill_display_id?: string | null;
					transaction_display_id?: string | null;
					type?: Database["public"]["Enums"]["NotificationType"];
				};
				Relationships: [
					{
						isOneToOne: false;
						referencedRelation: "bills";
						columns: ["bill_display_id"];
						referencedColumns: ["display_id"];
						foreignKeyName: "notifications_bill_display_id_fkey";
					},
					{
						isOneToOne: false;
						referencedColumns: ["display_id"];
						referencedRelation: "transactions";
						columns: ["transaction_display_id"];
						foreignKeyName: "notifications_transaction_display_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["trigger_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "notifications_trigger_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["user_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "notifications_user_id_fkey";
					}
				];
			};
			bills: {
				Row: {
					id: string;
					group_id: string;
					commit_id: string;
					issued_at: string;
					created_at: string;
					creator_id: string;
					display_id: string;
					creditor_id: string;
					description: string;
					total_amount: number;
					updated_at: string | null;
					updater_id: string | null;
					receipt_file: string | null;
				};
				Insert: {
					id?: string;
					group_id: string;
					commit_id: string;
					issued_at: string;
					creator_id: string;
					display_id: string;
					created_at?: string;
					creditor_id: string;
					description: string;
					total_amount: number;
					updated_at?: string | null;
					updater_id?: string | null;
					receipt_file?: string | null;
				};
				Update: {
					id?: string;
					group_id?: string;
					commit_id?: string;
					issued_at?: string;
					created_at?: string;
					creator_id?: string;
					display_id?: string;
					creditor_id?: string;
					description?: string;
					total_amount?: number;
					updated_at?: string | null;
					updater_id?: string | null;
					receipt_file?: string | null;
				};
				Relationships: [
					{
						isOneToOne: false;
						columns: ["creator_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "bills_creator_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["creditor_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "bills_creditor_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["group_id"];
						referencedColumns: ["id"];
						referencedRelation: "groups";
						foreignKeyName: "bills_group_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["updater_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "bills_updater_id_fkey";
					}
				];
			};
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
		? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;
