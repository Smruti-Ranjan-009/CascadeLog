from dotenv import load_dotenv
from groq import Groq
import json
import re


load_dotenv()

groq = Groq()

def classify_with_llm(log_msg):
    """
    Classify a log message into one of a small set of categories using
    an LLM fallback. This is the last tier in the cascade, used only
    when regex and the embedding + logistic regression classifier
    can't confidently label the message.
    """
    prompt = f'''Classify the log message into one of these categories:
    Workflow Error, Deprecation Warning.
    If you can't figure out a category, use "Unclassified".
    Put ONLY the category name inside <category> </category> tags.
    Do not include numbers, parentheses, or any other text inside the tags.
    Log message: {log_msg}'''

    chat_completion = groq.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        # model="llama-3.3-70b-versatile",
        model="openai/gpt-oss-20b",
        temperature=0
    )

    content = chat_completion.choices[0].message.content
    match = re.search(r'<category>(.*?)<\/category>', content, flags=re.DOTALL)
    category = "Unclassified"
    if match:
        category = match.group(1).strip()
        # Defensive cleanup: strip a leading "(n) " if the model includes
        # the option number anyway, and collapse any stray whitespace.
        category = re.sub(r'^\(\d+\)\s*', '', category)
        category = re.sub(r'\s+', ' ', category).strip()

    return category


if __name__ == "__main__":
    print(classify_with_llm(
        "Case escalation for ticket ID 7324 failed because the assigned support agent is no longer active."))
    print(classify_with_llm(
        "The 'ReportGenerator' module will be retired in version 4.0. Please migrate to the 'AdvancedAnalyticsSuite' by Dec 2025"))
    print(classify_with_llm("System reboot initiated by user 12345."))
