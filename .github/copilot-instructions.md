# Copilot Instructions for lusahaLoanapp

## Project Overview

**lusahaLoanapp** is a loan application platform. This document provides essential guidance for AI agents to be productive in this codebase.

## Architecture Notes

- **Status**: Early stage - project structure still being established
- **Key domains**: Loan applications, borrower management, approval workflows
- When the codebase expands, expect separation between:
  - Frontend (user-facing loan application forms)
  - Backend API (loan processing logic, approval workflows)
  - Data models (borrower profiles, loan products, application state)
  - Integration layer (external services, identity verification, credit checks)

## Development Workflow

- Repository uses `main` branch as primary branch
- Before implementing features, check existing branch structure and recent commits
- Configuration and environment setup details will be added as project grows

## Coding Conventions

- **Loan Application State**: Document the standard states (draft, submitted, under_review, approved, rejected, disbursed)
- **Borrower Data**: Establish clear patterns for PII handling and data validation
- **Error Handling**: Loan operations often have specific failure modes - document expected exceptions early
- **Testing**: Focus on approval workflow edge cases and validation rules specific to lending

## Key Integration Points

- Identify external dependencies (payment processing, credit bureaus, identity verification) as they're added
- Document third-party APIs and their rate limits/error handling patterns
- Establish clear data flow between frontend and backend

## Project Evolution

As the codebase grows, maintain this file by documenting:

1. Major architectural decisions and their rationale
2. Non-obvious patterns discovered during development
3. Specific commands for building, testing, and deploying
4. Common pitfalls and how to avoid them
