# IDDD Phase Guide

Reference for the id3-start router. Each phase lists signal keywords, routing conditions,
the target skill name, a one-line description, and produced artifacts.

## Phase 0/1: Entity Identification

- **Target skill:** /id3-identify-entities
- **Signal keywords:** new project, domain analysis, entity identification, information analysis, what entities, identify entities, analyze domain, start IDDD, begin project, what should I do next
- **Condition:** No `specs/entity-catalog.md` exists, OR entity-catalog version is "0.0", OR user explicitly requests entity work
- **Description:** Identify domain entities from existing code (brownfield) or through structured interview (greenfield)
- **Artifacts produced:** specs/entity-catalog.md (with entities, attributes, relationships), specs/data-model.md (Mermaid ERD), docs/business-rules.md

## Phase 2: Information Design

- **Target skill:** /id3-design-information
- **Signal keywords:** data model, information design, relationships, attributes, design information, refine model, logical model, schema design, constraints, business rules, indexes
- **Condition:** entity-catalog exists with version >= "0.1", user requests model refinement
- **Description:** Refine conceptual model into logical model with business rules, constraints, and derivation rules
- **Artifacts produced:** specs/data-model.md (updated ERD + relationships), docs/business-rules.md (derived rules)

## Phase 2.5: UI Design

- **Target skill:** /id3-design-ui
- **Signal keywords:** UI design, screen design, frontend, layout, wireframe, design ui, implement ui, screens, mockup, visual design, dashboard design
- **Condition:** data-model exists with version >= "1.0", user requests UI work
- **Fast-path (ROUT-05):** If the user's request contains ONLY explicit UI keywords (e.g., "design login screen", "create dashboard layout") AND a data-model already exists (version >= "1.0"), route here directly -- skip the entity identification question
- **Description:** Design and implement UI derived from the information model
- **Artifacts produced:** specs/ui-structure.md, specs/ui-design-contract.md, HTML mockups in .iddd/preview/

## Phase 3-5: Build (Agent Teams)

- **Target skill:** /id3-spawn-team
- **Signal keywords:** build, implement, code, develop, spawn team, start implementation, parallel implementation, agent team, create backend, generate code
- **Condition:** ui-structure exists with version > "0.0", user requests implementation
- **Description:** Spawn Agent Teams for parallel spec generation, implementation, and QA review
- **Artifacts produced:** Implementation code, tests, API endpoints

## Audit

- **Target skill:** /id3-info-audit
- **Signal keywords:** audit, verify, check model, drift, consistency check, run audit, information audit, model audit
- **Condition:** User requests audit at any point (no prerequisites beyond entity-catalog existing)
- **Description:** Compare information model against actual codebase for drift detection
- **Artifacts produced:** Audit report in .iddd/preview/

## Preview

- **Target skill:** /id3-preview
- **Signal keywords:** preview, visualize, show model, view ERD, show diagram, render, start preview, open preview
- **Condition:** User requests preview at any point (no prerequisites beyond specs files existing)
- **Description:** Generate HTML renderings of ERD, UI mockups, audit reports
- **Artifacts produced:** HTML files in .iddd/preview/

## Ambiguous Request Handling (ROUT-06)

If the user's request could match BOTH UI-related AND data/entity-related routes (e.g., "add filter to the list", "add a search feature", "update the user profile page"), ask:

"Should this be a UI-only change, or does it need new data/entities? Please clarify."

Examples of ambiguous requests:
- "add filter to list" -- could be UI filter widget OR new filter entity/attribute
- "add search" -- could be UI search bar OR search indexing infrastructure
- "update user profile" -- could be UI layout change OR new user attributes
- "add notifications" -- could be UI notification bell OR notification entity/system
- "improve the dashboard" -- could be UI layout adjustment OR new aggregate data
