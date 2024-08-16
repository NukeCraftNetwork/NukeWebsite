import { Prisma } from "@prisma/client";

export const getAllFullOpportunities = Prisma.sql`
with link_aggregates as (
select
	l."opportunityTitle",
	json_agg(json_build_object('type',
	l.type,
	'metadata',
	l.metadata,
	'href',
	l.href)) as links
from
	"Link" l
group by
	l."opportunityTitle"
),
view_counts as (
select
	"opportunityTitle",
	COUNT(*) as viewCount
from
	"View"
group by
	"opportunityTitle"
),
comment_counts as (
select
	"opportunityTitle",
	COUNT(*) as commentCount
from
	"Comment"
group by
	"opportunityTitle"
)
select
	o.tag,
	json_agg(
        json_build_object(
            'img',
	o.img,
	'title',
	o.title,
	'website',
	o.website,
	'smallDescription',
	o."smallDescription",
	'links',
	coalesce(lg.links,
	'[]'::json)
        )
    ) as opportunities
from
    "Opportunity" o
left join 
    link_aggregates lg on
	(o."title" = lg."opportunityTitle")
group by
	o.tag;
`;

export const getPublishedFullOpportunities = Prisma.sql`
with link_aggregates as (
select
	l."opportunityTitle",
	json_agg(json_build_object('type',
	l.type,
	'metadata',
	l.metadata,
	'href',
	l.href)) as links
from
	"Link" l
group by
	l."opportunityTitle"
),
view_counts as (
select
	"opportunityTitle",
	COUNT(*) as viewCount
from
	"View"
group by
	"opportunityTitle"
),
comment_counts as (
select
	"opportunityTitle",
	COUNT(*) as commentCount
from
	"Comment"
group by
	"opportunityTitle"
)
select
	o.tag,
	json_agg(
        json_build_object(
            'img',
	o.img,
	'title',
	o.title,
	'website',
	o.website,
	'smallDescription',
	o."smallDescription",
	'links',
	coalesce(lg.links,
	'[]'::json)
        )
    ) as opportunities
from
    "Opportunity" o
left join 
    link_aggregates lg on
	(o."title" = lg."opportunityTitle")
WHERE "isPublished" = 1
group by
	o.tag;
`;

/*
export const getAllFunds = Prisma.sql`
with link_aggregates as (
select
	l."opportunityTitle",
	json_agg(json_build_object('type',
	l.type,
	'metadata',
	l.metadata,
	'href',
	l.href)) as links
from
	"Link" l
group by
	l."opportunityTitle"
),
view_counts as (
select
	"opportunityTitle",
	COUNT(*) as viewCount
from
	"View"
group by
	"opportunityTitle"
),
comment_counts as (
select
	"opportunityTitle",
	COUNT(*) as commentCount
from
	"Comment"
group by
	"opportunityTitle"
)
select
	o.tag,
	json_agg(
        json_build_object(
            'img',
	o.img,
	'title',
	o.title,
	'website',
	o.website,
	'smallDescription',
	o."smallDescription",
	'links',
	coalesce(lg.links,
	'[]'::json)
        )
    ) as opportunities
from
    "Opportunity" o
left join 
    link_aggregates lg on
	(o."title" = lg."opportunityTitle")
group by
	o.tag;
`;

export const getPublishedFunds = Prisma.sql`
with link_aggregates as (
select
	l."opportunityTitle",
	json_agg(json_build_object('type',
	l.type,
	'metadata',
	l.metadata,
	'href',
	l.href)) as links
from
	"Link" l
group by
	l."opportunityTitle"
),
view_counts as (
select
	"opportunityTitle",
	COUNT(*) as viewCount
from
	"View"
group by
	"opportunityTitle"
),
comment_counts as (
select
	"opportunityTitle",
	COUNT(*) as commentCount
from
	"Comment"
group by
	"opportunityTitle"
)
select
	o.tag,
	json_agg(
        json_build_object(
            'img',
	o.img,
	'title',
	o.title,
	'website',
	o.website,
	'smallDescription',
	o."smallDescription",
	'links',
	coalesce(lg.links,
	'[]'::json)
        )
    ) as opportunities
from
    "Opportunity" o
left join 
    link_aggregates lg on
	(o."title" = lg."opportunityTitle")
WHERE "isPublished" = 1
group by
	o.tag;
`;
*/

export const getGroupedComments = Prisma.sql`SELECT v."opportunityTitle" , CAST(COUNT(*) as INTEGER) AS val FROM "Comment" v GROUP BY v."opportunityTitle";`;
export function getTotalViews(date: string) {
  let select = Prisma.sql`CAST(COUNT(*) AS TEXT) AS view_count`;
  let groupBy = Prisma.empty;
  if (date) {
    select = Prisma.sql`DATE_TRUNC(${date}, "date") AS interval, CAST(COUNT(*) AS TEXT) AS view_count`;
    groupBy = Prisma.sql`GROUP BY interval ORDER BY interval`;
  }
  const query = Prisma.sql`SELECT ${select} FROM "View" ${groupBy};`;
  return query;
}
export function getProjectViews(date: string) {
  let select = Prisma.sql`"opportunityTitle", CAST(COUNT(*) AS TEXT) AS view_count`;
  let groupBy = Prisma.sql`"opportunityTitle"`;
  if (date) {
    select = Prisma.sql`"opportunityTitle", DATE_TRUNC(${date}, "date") AS interval, CAST(COUNT(*) AS TEXT) AS view_count`;
    groupBy = Prisma.sql`interval, "opportunityTitle" ORDER BY interval`;
  }
  const query = Prisma.sql`SELECT ${select} FROM "View" GROUP BY ${groupBy};`;
  return query;
}
