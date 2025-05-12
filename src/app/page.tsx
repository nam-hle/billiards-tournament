import Link from "next/link";
import { Check, Split, Users, Share2, Receipt, ArrowRight, CreditCard } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/shadcn/tabs";

export default function LandingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
							<div className="flex flex-col justify-center space-y-4">
								<div className="space-y-2">
									<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
										Split bills with friends, without the awkwardness
									</h1>
									<p className="max-w-[600px] text-muted-foreground md:text-xl">
										BillPilot makes it easy to track shared expenses, split bills, and settle up with friends and roommates.
									</p>
								</div>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<Button asChild size="lg" className="h-12">
										<Link href="/signup">
											<ArrowRight className="ml-2 h-4 w-4" /> Start for free
										</Link>
									</Button>
								</div>
								<div className="flex items-center space-x-4 text-sm">
									<div className="flex items-center space-x-1.5">
										<Check className="h-4 w-4 text-green-500" />
										<span>Free plan available</span>
									</div>
									<div className="flex items-center space-x-1.5">
										<Check className="h-4 w-4 text-green-500" />
										<span>No credit card required</span>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<div className="relative h-[400px] w-full overflow-hidden rounded-lg border bg-background p-2 lg:h-[500px]">
									<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"></div>
									<div className="relative h-full w-full rounded-md bg-white p-4 shadow-lg">
										<div className="flex items-center justify-between border-b pb-2">
											<div className="flex items-center gap-2">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
													<Users className="h-4 w-4 text-blue-600" />
												</div>
												<span className="font-medium">Weekend Trip</span>
											</div>
											<div className="text-sm text-muted-foreground">Total: $1,250.00</div>
										</div>
										<div className="mt-4 space-y-3">
											<div className="rounded-md border p-3">
												<div className="flex justify-between">
													<div className="flex items-center gap-2">
														<Receipt className="h-4 w-4 text-green-500" />
														<span className="font-medium">Dinner at Luigi&#39;s</span>
													</div>
													<span>$180.00</span>
												</div>
												<div className="mt-2 text-sm text-muted-foreground">Paid by Alex • Split equally</div>
												<div className="mt-2 flex items-center gap-2">
													<div className="flex -space-x-2">
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs">A</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs">J</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs">M</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs">S</div>
													</div>
													<span className="text-xs text-muted-foreground">$45.00 each</span>
												</div>
											</div>
											<div className="rounded-md border p-3">
												<div className="flex justify-between">
													<div className="flex items-center gap-2">
														<CreditCard className="h-4 w-4 text-blue-500" />
														<span className="font-medium">Hotel Reservation</span>
													</div>
													<span>$750.00</span>
												</div>
												<div className="mt-2 text-sm text-muted-foreground">Paid by Jamie • Split equally</div>
												<div className="mt-2 flex items-center gap-2">
													<div className="flex -space-x-2">
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs">A</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs">J</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs">M</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs">S</div>
													</div>
													<span className="text-xs text-muted-foreground">$187.50 each</span>
												</div>
											</div>
											<div className="rounded-md border p-3">
												<div className="flex justify-between">
													<div className="flex items-center gap-2">
														<Share2 className="h-4 w-4 text-purple-500" />
														<span className="font-medium">Car Rental</span>
													</div>
													<span>$320.00</span>
												</div>
												<div className="mt-2 text-sm text-muted-foreground">Paid by Morgan • Split equally</div>
												<div className="mt-2 flex items-center gap-2">
													<div className="flex -space-x-2">
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs">A</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs">J</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs">M</div>
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs">S</div>
													</div>
													<span className="text-xs text-muted-foreground">$80.00 each</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="features" className="w-full bg-muted py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold">Features</div>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need to split bills</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									BillPilot provides all the tools you need to track expenses, split bills, and settle up with friends.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
							<div className="grid gap-4 text-center">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<Receipt className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold">Expense Tracking</h3>
								<p className="text-muted-foreground">
									Easily log expenses and keep track of who paid for what. Add photos of receipts for reference.
								</p>
							</div>
							<div className="grid gap-4 text-center">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<Split className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold">Flexible Splitting</h3>
								<p className="text-muted-foreground">
									Split bills equally, by percentage, by shares, or by exact amounts. Customize for each expense.
								</p>
							</div>
							<div className="grid gap-4 text-center">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<Users className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold">Group Management</h3>
								<p className="text-muted-foreground">Create groups for roommates, trips, events, or recurring activities. Keep expenses organized.</p>
							</div>
						</div>
					</div>
				</section>

				<section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold">How It Works</div>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, fast, and fair</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									BillPilot makes it easy to manage shared expenses in just a few steps.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
							<div className="flex flex-col justify-center space-y-4">
								<ul className="grid gap-6">
									<li className="flex items-start gap-4">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">1</div>
										<div className="grid gap-1">
											<h3 className="text-xl font-bold">Create a group</h3>
											<p className="text-muted-foreground">
												Start by creating a group for your roommates, trip, or event. Invite your friends to join.
											</p>
										</div>
									</li>
									<li className="flex items-start gap-4">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">2</div>
										<div className="grid gap-1">
											<h3 className="text-xl font-bold">Add expenses</h3>
											<p className="text-muted-foreground">
												Log expenses as they happen. Specify who paid and how to split the cost among group members.
											</p>
										</div>
									</li>
									<li className="flex items-start gap-4">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">3</div>
										<div className="grid gap-1">
											<h3 className="text-xl font-bold">Settle up</h3>
											<p className="text-muted-foreground">
												BillPilot calculates who owes what to whom. Settle debts through the app or mark them as paid.
											</p>
										</div>
									</li>
								</ul>
							</div>
							<div className="flex items-center justify-center">
								<div className="relative h-[400px] w-full overflow-hidden rounded-lg border bg-background p-2">
									<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"></div>
									<div className="relative h-full w-full rounded-md bg-white p-4 shadow-lg">
										<Tabs defaultValue="expenses" className="flex h-full flex-col">
											<TabsList className="grid w-full grid-cols-3">
												<TabsTrigger value="expenses">Expenses</TabsTrigger>
												<TabsTrigger value="balances">Balances</TabsTrigger>
												<TabsTrigger value="settle">Settle Up</TabsTrigger>
											</TabsList>
											<TabsContent value="expenses" className="flex-1 overflow-auto">
												<div className="mt-2 space-y-3">
													<div className="rounded-md border p-3">
														<div className="flex justify-between">
															<div className="flex items-center gap-2">
																<Receipt className="h-4 w-4 text-green-500" />
																<span className="font-medium">Dinner at Luigi&#39;s</span>
															</div>
															<span>$180.00</span>
														</div>
														<div className="mt-2 text-sm text-muted-foreground">Paid by Alex • Split equally</div>
													</div>
													<div className="rounded-md border p-3">
														<div className="flex justify-between">
															<div className="flex items-center gap-2">
																<CreditCard className="h-4 w-4 text-blue-500" />
																<span className="font-medium">Hotel Reservation</span>
															</div>
															<span>$750.00</span>
														</div>
														<div className="mt-2 text-sm text-muted-foreground">Paid by Jamie • Split equally</div>
													</div>
													<div className="rounded-md border p-3">
														<div className="flex justify-between">
															<div className="flex items-center gap-2">
																<Share2 className="h-4 w-4 text-purple-500" />
																<span className="font-medium">Car Rental</span>
															</div>
															<span>$320.00</span>
														</div>
														<div className="mt-2 text-sm text-muted-foreground">Paid by Morgan • Split equally</div>
													</div>
												</div>
											</TabsContent>
											<TabsContent value="balances" className="flex-1">
												<div className="mt-2 space-y-3">
													<div className="rounded-md border p-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-xs">A</div>
																<span>Alex</span>
															</div>
															<span className="text-green-600">+$45.00</span>
														</div>
													</div>
													<div className="rounded-md border p-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs">J</div>
																<span>Jamie</span>
															</div>
															<span className="text-green-600">+$187.50</span>
														</div>
													</div>
													<div className="rounded-md border p-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs">M</div>
																<span>Morgan</span>
															</div>
															<span className="text-green-600">+$80.00</span>
														</div>
													</div>
													<div className="rounded-md border p-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs">S</div>
																<span>Sam</span>
															</div>
															<span className="text-red-600">-$312.50</span>
														</div>
													</div>
												</div>
											</TabsContent>
											<TabsContent value="settle" className="flex-1">
												<div className="mt-2 space-y-3">
													<div className="rounded-md border p-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs">S</div>
																<span>Sam owes Alex</span>
															</div>
															<span>$45.00</span>
														</div>
														<div className="mt-2">
															<Button size="sm" className="w-full">
																Settle Up
															</Button>
														</div>
													</div>
													<div className="rounded-md border p-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs">S</div>
																<span>Sam owes Jamie</span>
															</div>
															<span>$187.50</span>
														</div>
														<div className="mt-2">
															<Button size="sm" className="w-full">
																Settle Up
															</Button>
														</div>
													</div>
													<div className="rounded-md border p-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs">S</div>
																<span>Sam owes Morgan</span>
															</div>
															<span>$80.00</span>
														</div>
														<div className="mt-2">
															<Button size="sm" className="w-full">
																Settle Up
															</Button>
														</div>
													</div>
												</div>
											</TabsContent>
										</Tabs>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="pricing" className="w-full bg-muted py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold">Pricing</div>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, transparent pricing</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Choose the plan that&#39;s right for you and your friends.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
							<div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
								<div className="flex-1">
									<div className="text-sm font-medium uppercase text-muted-foreground">Free</div>
									<div className="mt-4 flex items-baseline text-3xl font-bold">
										$0
										<span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
									</div>
									<ul className="mt-6 space-y-3">
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Up to 5 groups</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Basic expense tracking</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Equal splitting</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Email support</span>
										</li>
									</ul>
								</div>
								<div className="mt-6">
									<Button className="w-full">Get Started</Button>
								</div>
							</div>
							<div className="relative flex flex-col rounded-lg border bg-background p-6 shadow-sm">
								<div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
									Popular
								</div>
								<div className="flex-1">
									<div className="text-sm font-medium uppercase text-muted-foreground">Pro</div>
									<div className="mt-4 flex items-baseline text-3xl font-bold">
										$4.99
										<span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
									</div>
									<ul className="mt-6 space-y-3">
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Unlimited groups</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Advanced expense tracking</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>All splitting methods</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Receipt scanning</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Priority support</span>
										</li>
									</ul>
								</div>
								<div className="mt-6">
									<Button className="w-full">Get Started</Button>
								</div>
							</div>
							<div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
								<div className="flex-1">
									<div className="text-sm font-medium uppercase text-muted-foreground">Team</div>
									<div className="mt-4 flex items-baseline text-3xl font-bold">
										$9.99
										<span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
									</div>
									<ul className="mt-6 space-y-3">
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Everything in Pro</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Team management</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Expense categories</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>Expense reports</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>API access</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span>24/7 support</span>
										</li>
									</ul>
								</div>
								<div className="mt-6">
									<Button className="w-full">Get Started</Button>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to simplify bill splitting?</h2>
							<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Join thousands of users who are already enjoying stress-free expense sharing with BillPilot.
							</p>
						</div>
						<div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
							<Button size="lg" className="h-12">
								Start for free
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
							<Button size="lg" className="h-12" variant="outline">
								View Demo
							</Button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
