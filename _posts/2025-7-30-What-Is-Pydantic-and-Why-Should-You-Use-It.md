---

layout: post

title: What Is Pydantic and Why Should You Use It?

---

If you've been building Python applications, especially anything involving APIs or AI, you've probably run into a frustrating problem: bad data sneaking into your code.

Maybe a function expected an integer but got a string. Maybe an API response came back with missing fields. Maybe you spent 30 minutes debugging only to realize a dictionary key was misspelled. These kinds of bugs are silent, annoying, and surprisingly common in Python.

So how do you fix this? Meet **Pydantic**.

---

## What Is Pydantic?

**Pydantic** is a Python library for data validation using type hints. You define what your data _should_ look like using Python classes, and Pydantic makes sure the data actually matches, at runtime.

> "Pydantic is the most widely used data validation library for Python. It uses Python type hints to validate data, serialize it, and generate JSON schemas, all with a clean, Pythonic API."
>
> — [Pydantic Docs](https://docs.pydantic.dev/latest/)

### Think of It Like a Bouncer at a Club

Imagine your function is a club, and the data coming in is a guest. Without Pydantic, anyone walks in, no ID check, no guest list. With Pydantic, there's a bouncer at the door: wrong type? Rejected. Missing field? Rejected. Everything checks out? Come on in.

---

## A Simple Example

Let's start with the basics. Here's how you'd define a simple data model with Pydantic:

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str
```

Now let's use it:

```python
# This works perfectly
user = User(name="Jorge", age=28, email="jorge@example.com")
print(user.name)  # Jorge

# Pydantic even converts types when possible
user2 = User(name="Dave", age="30", email="dave@example.com")
print(user2.age)  # 30 (converted from string to int!)

# This will raise a validation error
try:
    bad_user = User(name="Test", age="not a number", email="test@example.com")
except Exception as e:
    print(e)
    # age: Input should be a valid integer
```

That's it. You define a class, add type hints, and Pydantic handles the rest. No more writing manual `if isinstance(...)` checks everywhere.

---

## Why Pydantic Matters

I started paying attention to Pydantic when I noticed it's used _everywhere_ in the AI and data engineering ecosystem:

- **FastAPI** uses Pydantic for request/response validation
- **LangChain** uses Pydantic for structured outputs from LLMs
- **PydanticAI** is a whole agent framework built on top of it
- **OpenAI's API** returns structured data that maps perfectly to Pydantic models

### Benefits of using Pydantic:

- **Catches bugs early** by validating data at runtime
- **Self-documenting code** — your models describe the data shape
- **Automatic type coercion** — converts compatible types for you
- **JSON serialization** — convert to/from JSON with one method call
- **IDE support** — full autocomplete and type checking

---

## Going Deeper: Nested Models and Validators

Pydantic really shines when your data gets more complex. Let's look at nested models:

```python
from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional

class Address(BaseModel):
    street: str
    city: str
    country: str = "Canada"  # Default value

class Employee(BaseModel):
    name: str
    age: int
    email: str
    address: Address  # Nested model!
    skills: List[str] = []  # List with default

    @field_validator("age")
    @classmethod
    def age_must_be_positive(cls, v):
        if v < 0:
            raise ValueError("Age must be positive")
        return v
```

Now we can create an employee with a nested address:

```python
emp = Employee(
    name="Jorge",
    age=28,
    email="jorge@example.com",
    address={"street": "123 Main St", "city": "Calgary", "country": "Canada"},
    skills=["Python", "SQL", "Data Modeling"]
)

print(emp.address.city)  # Calgary
print(emp.model_dump())  # Convert to dictionary
print(emp.model_dump_json())  # Convert to JSON string
```

✅ Why this matters: In real-world applications, data is rarely flat. Pydantic handles nested structures, lists, optional fields, and custom validation, all with clean syntax.

---

## Pydantic + AI: Structured LLM Outputs

Here's where it gets really interesting for AI applications. LLMs return text, but often you need _structured_ data. Pydantic solves this:

```python
from pydantic import BaseModel
from openai import OpenAI

class MovieReview(BaseModel):
    title: str
    rating: float
    summary: str
    recommend: bool

client = OpenAI()

completion = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Extract movie review details."},
        {"role": "user", "content": "I just watched Inception. Solid 9/10. Mind-bending plot with great visuals. Definitely watch it."}
    ],
    response_format=MovieReview,
)

review = completion.choices[0].message.parsed
print(review.title)      # Inception
print(review.rating)     # 9.0
print(review.recommend)  # True
```

✅ Why this matters: Instead of parsing messy text or hoping the LLM returns valid JSON, Pydantic guarantees the output matches your schema. This is the foundation of reliable AI applications.

---

## Quick Reference: Key Pydantic Features

| Feature | What It Does |
|---|---|
| `BaseModel` | Define data models with type hints |
| `field_validator` | Add custom validation logic |
| `model_dump()` | Convert model to dictionary |
| `model_dump_json()` | Convert model to JSON string |
| `model_validate()` | Create model from dictionary |
| `Optional[type]` | Mark fields as optional |
| Default values | Set fallback values for fields |

---

## Summary

Pydantic takes Python's type hints and turns them into a runtime validation system. You define what your data should look like, and Pydantic enforces it. No more silent bugs from bad data, no more manual type checking, no more guessing what shape your data is in.

If you're building anything with Python, whether it's an API, a data pipeline, or an AI application, Pydantic should be in your toolkit.

---

## Resources

- 📺 [Pydantic Crash Course by Dave Ebbelaar](https://youtu.be/PkQIREapb9o) — The video that inspired this post
- 📖 [Pydantic Official Docs](https://docs.pydantic.dev/latest/)
- 🤖 [PydanticAI Framework](https://ai.pydantic.dev/) — For building AI agents with Pydantic

---

## Final Thoughts

When I was learning about RAG and LangChain, I kept seeing Pydantic show up in every tutorial. At first I thought it was just a nice-to-have, but once I started using it, I realized it's essential. It's the difference between code that _might_ work and code that _definitely_ works.

Start simple. Define a `BaseModel`. Add some type hints. Let Pydantic do the heavy lifting.

Cheers,

Jorge Rocha
