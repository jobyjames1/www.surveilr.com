#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run --allow-sys
import { sqlPageNB as spn } from "./deps.ts";
import {
  console as c,
  orchestration as orch,
  shell as sh,
  uniformResource as ur,
} from "../../std/web-ui-content/mod.ts";

const WEB_UI_TITLE = "Qualityfolio";
const WE_UI_LOGO = "qf-logo.png";
const WE_UI_FAV_ICON = "qf-favicon.ico";

/**
 * These pages depend on ../../std/package.sql.ts being loaded into RSSD (for nav).
 *
 * TODO: in TypicalSqlPageNotebook.SQL() call at the bottom of this code it
 * probably makese sense to just add all dependent notebooks into the sources
 * list like so:
 *
 *   TypicalSqlPageNotebook.SQL(new X(), new Y(), ..., new FhirSqlPages())
 *
 * where X, Y, etc. are in lib/std/content/mod.ts
 */

// custom decorator that makes navigation for this notebook type-safe
function qltyfolioNav(route: Omit<spn.RouteConfig, "path" | "parentPath">) {
  return spn.navigationPrime({
    ...route,
    parentPath: "qltyfolio/index.sql",
  });
}

/**
 * These pages depend on ../../prime/ux.sql.ts being loaded into RSSD (for nav).
 */
export class QualityfolioSqlPages extends spn.TypicalSqlPageNotebook {
  // TypicalSqlPageNotebook.SQL injects any method that ends with `DQL`, `DML`,
  // or `DDL` as general SQL before doing any upserts into sqlpage_files.
  navigationDML() {
    return this.SQL`
      -- delete all /qltyfolio-related entries and recreate them in case routes are changed
      DELETE FROM sqlpage_aide_navigation WHERE parent_path like ${
      this.constructHomePath("qltyfolio")
    };
      ${this.upsertNavSQL(...Array.from(this.navigation.values()))}
    `;
  }
  @spn.shell({ breadcrumbsFromNavStmts: "no" })
  "qltyfolio/test-suites.sql"() {
    return this.SQL`
 
    SELECT 'title'AS component, 
     'Test Suite' as contents; 
        SELECT 'text' as component,
        'Test suite is a collection of test cases designed to verify the functionality, performance, and security of a software application. It ensures that the application meets the specified requirements by executing predefined tests across various scenarios, identifying defects, and validating that the system works as intended.' as contents;

     SELECT 'table' as component,
        'Column Count' as align_right,
        TRUE as sort,
        TRUE as search,
        'id' as markdown;
      SELECT 
      '['||id||']('||${
      this.absoluteURL("/qltyfolio/suite-data.sql")
    }||'?id='||id||')' as id,
      
      name,
      created_by as "Created By",
      strftime('%d-%m-%Y',  created_at) as "Created On"
      FROM test_suites order by id asc;
    `;
  }

  @spn.navigationPrimeTopLevel({
    caption: "Test Management System",
    description: "Test management system",
  })
  "qltyfolio/index.sql"() {
    return this.SQL`

    SELECT 'text' as component,
    'The dashboard provides a centralized view of your testing efforts, displaying key metrics such as test progress, results, and team productivity. It offers visual insights with charts and reports, enabling efficient tracking of test runs, milestones, and issue trends, ensuring streamlined collaboration and enhanced test management throughout the project lifecycle.' as contents;
    select 
    'card' as component,
   4      as columns;

select
    '## Total Test Cases Count' as description_md,
 
    'white' as background_color,
    '## '||count(test_case_id) as description_md,
    '12' as width,
     'red' as color,
    'brand-speedtest'       as icon
    FROM test_cases ;
select
    '## Test Execution Status Summary' as description_md,   
    'white' as background_color,
    
    '###  Passed: '||SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) as description_md,
    '### Failed: '||SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as description_md,
    '### TODO: '|| SUM(CASE WHEN status is null THEN 1 ELSE 0 END) as description_md,
    '12' as width,
     'green' as color,
    'progress-check'       as icon
   FROM 
    test_cases t
LEFT JOIN 
    test_case_run_profile r
ON 
    t.test_case_id = r.test_case_id;

select
    '## Comprehensive Test Case Count' as description_md, 
    'white' as background_color,
    '### Automated : '||SUM(CASE WHEN test_type = 'Automation' THEN 1 ELSE 0 END) as description_md,
    '### Manual : '||SUM(CASE WHEN test_type = 'manual' THEN 1 ELSE 0 END) as description_md,
    '12' as width,
     'yellow' as color,
    'automation'       as icon
    FROM test_cases ;  
     select
    '## Total Test Suites Count' as description_md,
    'white' as background_color,
    '## '||count(id) as description_md,
    '12' as width,
    'sum'       as icon
    FROM test_suites ;  
   
--    SELECT
--     '## Total Automated Test Case Coverage' AS description_md,
--     'white' AS background_color,
--     '### Automated: ' || SUM(CASE WHEN test_type = 'Automation' THEN 1 ELSE 0 END) || 
--     ' (' || ROUND(100.0 * SUM(CASE WHEN test_type = 'Automation' THEN 1 ELSE 0 END) / COUNT(*), 2) || '%)' AS description_md,
--     '### Manual: ' || SUM(CASE WHEN test_type = 'manual' THEN 1 ELSE 0 END) || 
--     ' (' || ROUND(100.0 * SUM(CASE WHEN test_type = 'manual' THEN 1 ELSE 0 END) / COUNT(*), 2) || '%)' AS description_md,
--     '12' AS width,
--     'orange' AS color,
--     'brand-ansible' AS icon
-- FROM
--     test_cases;
    
-- select 
--     'card' as component,
--     2      as columns;
-- select 
--     '/qltyfolio/chart1.sql?_sqlpage_embed' as embed;
-- select 
--     '/qltyfolio/chart2.sql?_sqlpage_embed' as embed;


select 
    'card' as component,
    2      as columns;
select 
    ${this.absoluteURL("/qltyfolio/chart1.sql?_sqlpage_embed")} as embed;
select 
    ${this.absoluteURL("/qltyfolio/chart2.sql?_sqlpage_embed")} as embed;
    
 SELECT 'title'AS component, 
     'Test Suite List' as contents; 
        SELECT 'text' as component;

 SELECT 'table' as component,
        'Column Count' as align_right,
        TRUE as sort,
        TRUE as search,
        'id' as markdown;
      SELECT
      '['||id||']('||${
      this.absoluteURL("/qltyfolio/suite-data.sql")
    }||'?id='||id||')' as id,
      
      name,
      created_by as "Created By",
      strftime('%d-%m-%Y',  created_at) as "Created On"
      FROM test_suites order by id asc;    

    `;
  }
  @spn.shell({
    breadcrumbsFromNavStmts: "no",
    shellStmts: "do-not-include",
  })
  "qltyfolio/chart1.sql"() {
    return this.SQL`
    --First Chart: Test Case Status Distribution
    SELECT
    'chart' AS component,
      'Comprehensive Test Status' AS title,
        'pie' AS type,
          TRUE AS labels,
            'chart-left' AS class; --Custom class for styling the first chart

    --Data for the first chart
SELECT
    'Passed' AS label,
      ROUND(100.0 * SUM(CASE WHEN r.status = 'passed' THEN 1 ELSE 0 END) / COUNT(t.test_case_id), 2) AS value
    FROM 
    test_cases t
LEFT JOIN 
    test_case_run_profile r
    ON
    t.test_case_id = r.test_case_id;

    SELECT
    'Failed' AS label,
      ROUND(100.0 * SUM(CASE WHEN r.status = 'failed' THEN 1 ELSE 0 END) / COUNT(t.test_case_id), 2) AS value
    FROM 
    test_cases t
LEFT JOIN 
    test_case_run_profile r
    ON
    t.test_case_id = r.test_case_id;

    SELECT
    'Todo' AS label,
      ROUND(100.0 * (COUNT(t.test_case_id) - COUNT(r.test_case_id)) / COUNT(t.test_case_id), 2) AS value
    FROM 
    test_cases t
LEFT JOIN 
    test_case_run_profile r
    ON
    t.test_case_id = r.test_case_id;
  `;
  }
  @spn.shell({ breadcrumbsFromNavStmts: "no", shellStmts: "do-not-include" })
  "qltyfolio/chart2.sql"() {
    return this.SQL`
SELECT 
    'chart' AS component,
    'Total Automated Test Case Coverage' AS title,
    'pie' AS type,
    TRUE AS labels,
    'chart-right' AS class; -- Custom class for styling the second chart

-- Data for the second chart
SELECT 
    'Automated' AS label,
    ROUND(100.0 * SUM(CASE WHEN test_type = 'Automation' THEN 1 ELSE 0 END) / COUNT(*), 2) AS value
FROM 
    test_cases;

SELECT 
    'Manual' AS label,
    ROUND(100.0 * SUM(CASE WHEN test_type = 'manual' THEN 1 ELSE 0 END) / COUNT(*), 2) AS value
FROM 
    test_cases;
  `;
  }
  @spn.shell({ breadcrumbsFromNavStmts: "no" })
  "qltyfolio/suite-data.sql"() {
    return this.SQL`
    select
    'breadcrumb' as component;
    select
    'Home' as title,
      ${this.absoluteURL("/")} as link;
    select
    'Test Management System' as title,
      ${this.absoluteURL("/qltyfolio/index.sql")} as link;
    select
    "name" as title from test_suites where CAST(id AS TEXT) = CAST($id AS TEXT);
    SELECT 'title'AS component,
      name as contents FROM test_suites  WHERE id = $id; 
     SELECT 'list'  AS component;
    SELECT
    '\n **Description**  :  ' || rn."description" AS description_md,
      '\n **Created By**  :  ' || rn.created_by AS description_md,
        '\n **Created At**  :  ' || rn.created_at AS description_md,
          '\n **Priority**  :  ' || rn.linked_requirements AS description_md,
            '\n' || rn.body AS description_md
FROM test_suites rn WHERE id = $id;

SELECT 'title'  AS component,
      'Test Case Group' as contents;
    --SELECT
    -- 'A structured summary of a specific test scenario, detailing its purpose, preconditions, test data, steps, and expected results. The description ensures clarity on the tests objective, enabling accurate validation of functionality or compliance. It aligns with defined requirements, identifies edge cases, and facilitates efficient defect detection during execution.
    -- ' as empty_description;

SELECT 'table' as component,
      TRUE AS sort,
        --TRUE AS search,
          'URL' AS align_left,
            'title' AS align_left,
              'group' as markdown,
              'id' as markdown,
              'Test Cases' as markdown;
    SELECT
    '[' || group_id || '](' || ${
      this.absoluteURL("/qltyfolio/group-detail.sql?id=")
    }|| group_id || ')' as id,
      group_name AS "title",
        '[' || test_case_count || '](' || ${
      this.absoluteURL("/qltyfolio/test-cases.sql?id=")
    }|| group_id || ')' AS 'Test Cases',
          created_by as "Created By",
          formatted_test_case_created_at as "Created On"
    FROM test_suites_test_case_count
    WHERE suite_id = $id order by group_id asc;


    `;
  }
  @spn.shell({ breadcrumbsFromNavStmts: "no" })
  "qltyfolio/test-cases.sql"() {
    return this.SQL`
    select
    'breadcrumb' as component;
    select
    'Home' as title,
      ${this.absoluteURL("/")} as link;
    select
    'Test Management System' as title,
      ${this.absoluteURL("/qltyfolio/index.sql")} as link;
    select
    s."name" as title,
      ${this.absoluteURL("/qltyfolio/suite-data.sql?id=")}|| suite_id as link
         FROM test_case_data g
        inner join  test_suites s on g.suite_id = s.id
          WHERE  group_id = $id group by group_name;
    select
    group_name as title FROM test_case_data
    WHERE  group_id = $id group by group_name;
    SELECT 'list'  AS component,
      group_name as title FROM test_case_data
    WHERE  group_id = $id group by group_name;
    SELECT
    'A structured summary of a specific test scenario, detailing its purpose, preconditions, test data, steps, and expected results. The description ensures clarity on the tests objective, enabling accurate validation of functionality or compliance. It aligns with defined requirements, identifies edge cases, and facilitates efficient defect detection during execution.
    ' as description;
    SELECT 'table' as component,
<<<<<<< HEAD
 TRUE AS sort, 
      -- TRUE AS search, 
      'URL' AS align_left, 
      'title' AS align_left,
      'group' as markdown,
      'id' as markdown,
      'count'  as markdown;
    '[' || test_case_id || '](' || ${
      this.absoluteURL("/qltyfolio/test-detail.sql?tab=actual-result&id=")
    }|| test_case_id || ')' as id,
>>>>>>> 97fa4fab4fa8f3cd285191d1f3d03049a304c084
      test_case_title AS "title",
        group_name AS "group",
          test_case_created_by as "Created By",
          formatted_test_case_created_at as "Created On",
          test_case_priority as "Priority"
    FROM test_case_data
    WHERE  group_id = $id 

    `;
  }

  @spn.shell({ breadcrumbsFromNavStmts: "no" })
  "qltyfolio/suite-group.sql"() {
    return this.SQL`

    --Define tabs
    SELECT
    'tab' AS component,
      TRUE AS center;

    --Tab 1: Test Suite list
    SELECT
    'Test Plan List' AS title,
      ${this.absoluteURL("/qltyfolio/suite-group?tab=test_suites")} AS link,
        $tab = 'test_suites' AS active;


    --Tab 2: Test case list
    SELECT
    'Test Case List' AS title,
      ${this.absoluteURL("/qltyfolio/suite-group?tab=test_cases")} AS link,
        $tab = 'test_cases' AS active;

    --Tab 3: Meta Tags Missing URLs
    SELECT
    'Test Run List' AS title,
      $tab = 'test_run' AS active;

    SELECT 
      case when $tab = 'test_suites' THEN 'list'
      END AS component;
    SELECT
    ' **Name**  :  ' || rn.name AS description_md,
      '\n **Description**  :  ' || rn."description" AS description_md,
        '\n **Created By**  :  ' || rn.created_by AS description_md,
          '\n **Created At**  :  ' || rn.created_at AS description_md,
            '\n **Priority**  :  ' || rn.linked_requirements AS description_md,
              '\n' || rn.body AS description_md
FROM test_suites rn WHERE id = $id;


    --Define component type based on active tab
    SELECT
    CASE
        WHEN $tab = 'test_cases' THEN 'table'
        WHEN $tab = 'test_suites' THEN 'table'
        WHEN $tab = 'test_run' THEN 'table'
      END AS component,
      TRUE AS sort,
        --TRUE AS search,
          'URL' AS align_left,
            'title' AS align_left,
              'group' as markdown,
              'id' as markdown,
              'count' as markdown;

    --Conditional content based on active tab

    --Tab - specific content for "test_suites"
    SELECT
      '[' || test_case_id || '](' || ${
      this.absoluteURL("/qltyfolio/test-detail.sql?tab=actual-result&id=")
    }|| test_case_id || ')' as id,
      test_case_title AS "title",
        group_name AS "group",
          test_case_created_by as "Created By",
          formatted_test_case_created_at as "Created On",
          test_case_priority as "Priority"
    FROM test_case_data
    WHERE $tab = 'test_cases' and group_id = $id 
    order by test_case_id;




    --Tab - specific content for "test_run"
   SELECT
      name AS "Property Name"
    FROM groups
    WHERE $tab = 'test_run';


    `;
  }
  @qltyfolioNav({
    caption: "Projects",
    description: ``,
    siblingOrder: 1,
  })
  "qltyfolio/test-management.sql"() {
    return this.SQL`
      ${this.activePageTitle()}

      SELECT 'list' AS component,
      'Column Count' as align_right,
      TRUE as sort,
      TRUE as search;



    SELECT
    '[' || project_name || '](/qltyfolio/detail.sql?name=' || project || ')' as description_md
      from projects

      `;
  }
  @spn.shell({ breadcrumbsFromNavStmts: "no" })
  "qltyfolio/test-detail.sql"() {
    return this.SQL`
      ${this.activePageTitle()}

    select
    'breadcrumb' as component;
    select
    'Home' as title,
      ${this.absoluteURL("/")} as link;
    select
    'Test Management System' as title,
      ${this.absoluteURL("/qltyfolio/index.sql")} as link; 
    select s.name as title,
      ${this.absoluteURL("/qltyfolio/suite-data.sql?id=")} || s.id as link
         FROM test_cases r
         INNER JOIN groups g on g.id = r.group_id 
         INNER JOIN test_suites s on s.id = g.suite_id
         where test_case_id = $id
         group by title;  
    select g.name as title,
      ${this.absoluteURL("/qltyfolio/test-cases.sql?id=")} || g.id as link
         FROM test_cases r
         INNER JOIN groups g on g.id = r.group_id 
         where test_case_id = $id
         group by title;
         
    SELECT title FROM test_cases where test_case_id = $id;      
         

         

    SELECT 'title'AS component,
      title as contents FROM test_cases where test_case_id = $id; 

    SELECT 'list'AS component;
    SELECT
    '\n **Status**  :  ' || rn."status" AS description_md,
      '\n **Start Time**  :  ' || rn."start_time" AS description_md,
        '\n **End Time**  :  ' || rn."end_time" AS description_md,
          '\n **Duration**  :  ' || rn."total_duration" AS description_md,
            '\n **Title**  :  ' || bd.title AS description_md,
              '\n **Created By**  :  ' || bd.created_by AS description_md,
                '\n **Created At**  :  ' || bd.created_at AS description_md,
                  '\n **Priority**  :  ' || bd.priority AS description_md,
                    '\n' || bd.body AS description_md
FROM  test_case_md_body bd 
LEFT JOIN test_case_run_profile rn ON  bd.test_case_id = rn.test_case_id
WHERE bd.test_case_id = $id;


--Define tabs
    SELECT
    'tab' AS component,
      TRUE AS center;

    --Tab 1: Test Suite list
    SELECT
    'Actual Result' AS title,
      ${
      this.absoluteURL("/qltyfolio/test-detail.sql?tab=actual-result&id=")
    }||$id AS link,
        $tab = 'actual-result' AS active;


    --Tab 2: Test case list
    SELECT
    'Souce Code' AS title,
      ${
      this.absoluteURL("/qltyfolio/test-detail.sql?tab=source-code&id=")
    }||$id AS link,
        $tab = 'source-code' AS active;



    SELECT
    CASE
        WHEN $tab = 'actual-result' THEN 'title'
    END AS component,  
     'Actual Result' as contents   
    FROM test_case_run_profile WHERE test_case_id = $id;

     SELECT
    CASE
        WHEN $tab = 'actual-result' THEN 'table'
        WHEN $tab = 'source-code' THEN 'code'
      END AS component,
        'Column Count' as align_right,
      TRUE as sort,
      TRUE as search
        FROM test_case_run_profile  where test_case_id = $id;


   --Tab - specific content for "actual-result"  

      
    SELECT
    step_name as 'Activity',
      step_status as 'Activity Status',
      step_start_time as 'Start Time',
      step_end_time as 'End Time'
          FROM test_case_run_profile_details
          WHERE $tab = 'actual-result' and  test_case_id = $id; 
    

    --Tab - specific content for "source-code"
    select 'code' AS component;
    select content as contents FROM test_case_run_profile where $tab = 'source-code' and  test_case_id = $id; 

    
`;
  }
  @spn.shell({ breadcrumbsFromNavStmts: "no" })
  "qltyfolio/group-detail.sql"() {
    return this.SQL`
      ${this.activePageTitle()}

    select
    'breadcrumb' as component;
    select
    'Home' as title,
      ${this.absoluteURL("/")} as link;
    select
    'Test Management System' as title,
      ${this.absoluteURL("/qltyfolio/index.sql")} as link;
    select
    s."name" as title,
      ${this.absoluteURL("/qltyfolio/suite-data.sql?id=")} || s.id as link
         from groups g
        inner join  test_suites s on s.id = g.suite_id where g.id = $id;
    select
    g."name" as title from groups g
        inner join  test_suites s on s.id = g.suite_id where g.id = $id;
        

    SELECT 'title'AS component,
      name as contents FROM groups where id = $id; 

    SELECT 'list'AS component;
    SELECT
    ' **Id**  :  ' || rn.id AS description_md,
      '\n **name**  :  ' || rn."name" AS description_md,
        '\n **Description**  :  ' || rn."description" AS description_md,
          '\n **Created By**  :  ' || rn."created_by" AS description_md,
            '\n **Created On**  :  ' || strftime('%d-%m-%Y', rn."created_at") AS description_md,
              '\n' || rn.body AS description_md
FROM groups rn
INNER JOIN test_suites st ON st.id = rn.suite_id
WHERE rn.id = $id;

    `;
  }
  @spn.shell({ breadcrumbsFromNavStmts: "no" })
  "qltyfolio/jsonviewer.sql"() {
    return this.SQL`
    select 'code' AS component;
select content as contents from uniform_resource where uniform_resource_id='01JFHAZ7RV7BZ1PQEWAYEWVWM0' ;
    `;
  }
}

export async function SQL() {
  return await spn.TypicalSqlPageNotebook.SQL(
    new class extends spn.TypicalSqlPageNotebook {
      async statelessqltyfolioSQL() {
        // read the file from either local or remote (depending on location of this file)
        return await spn.TypicalSqlPageNotebook.fetchText(
          import.meta.resolve("./stateless.sql"),
        );
      }
    }(),
    new QualityfolioSqlPages(),
    new ur.UniformResourceSqlPages(),
    new orch.OrchestrationSqlPages(),
    new c.ConsoleSqlPages(),
    new sh.ShellSqlPages(WEB_UI_TITLE, WE_UI_LOGO, WE_UI_FAV_ICON),
  );
}

// this will be used by any callers who want to serve it as a CLI with SDTOUT
if (import.meta.main) {
  console.log((await SQL()).join("\n"));
}