export type OpportunityProps = {
  idx?: number;
  img: string;
  tag: string;
  title: string;
  smallDescription: string;
  website: string;
  placeholder?: boolean;
  //    Interested     Not Interested    No value provided
  type: "interested" | "notInterested" | "noInterestEx";
};
export type AxiosAggr = {
  opportunityTitle: string;
  val: number;
};
export type Media = {
  href: string;
  type: string;
  metadata?: string | null;
};
