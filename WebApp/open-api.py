from threading import Thread

import openai
from flask import Flask, request, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS, cross_origin
import requests
import tiktoken as tiktoken

app = Flask(__name__)
CORS(app)
app.app_context()

ton = ""
style = ""
context = ""
openai.api_key = ""

preprompt = """Ecris moi une réponse pour ce mail, en adoptant un ton [0] et un style d'écriture [1]. 
                Pour répondre a ce mail prends en considération les contextes suivants \n[2]: \n\n"""

prompt = ""

messages = [
    {"role": "user", "content": f"{preprompt} {prompt}"},
]

model = "gpt-3.5-turbo"

responses = []
msg_queue = []

def addParaPrePrompt(ton, style, context):
    global preprompt
    preprompt = preprompt.replace('[0]', ton).replace('[1]', style).replace('[2]', context)


def user_input(input):
    ton = input.split('XYW2')[1]
    style = input.split('XYW2')[2].split('::')[0]
    context = input.split('WXZYF45')[1].split('::')[0].replace(',', '\n')
    addParaPrePrompt(ton, style, context)
    msg = input.split('::')[1].replace('WXZZ', '?')
    print("prepromt + message" + preprompt, msg)

    msg_queue.append({"role": "user", "content": f"{preprompt} {msg}"})


@app.route('/<input>', methods=['GET', 'POST'])
def index(input):

    user_input_thread = Thread(target=user_input, args=(input,))
    user_input_thread.start()
    user_input_thread.join()

    fetch_completion_thread = Thread(target=get_completion_openai)
    fetch_completion_thread.start()
    fetch_completion_thread.join()

    return jsonify(responses[responses.__len__() - 1]['choices'][0]['message']['content'])


def get_completion_openai():
    response = openai.ChatCompletion.create(
        model=model,
        messages=msg_queue,
        temperature=0.7
    )

    print(response.choices[0].message["content"])
    print(response.usage.prompt_tokens, " tokens for prompt.")
    print(response.usage.completion_tokens, " tokens for completion.")
    print(response.usage.total_tokens, " tokens total.")

    responses.append(response)

# Swagger UI setup
SWAGGER_URL = "/swagger"
API_URL = "/static/swagger.json"

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        "app_name": "OpenAI API"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

app.run(debug=True)
