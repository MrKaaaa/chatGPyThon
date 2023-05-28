from threading import Thread

import openai
from flask import Flask, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.app_context()

ton = ""
style = ""
context = ""
openai.api_key = ""

preprompt = """Agis comme si tu étais ChatGpyThon, en tant que tel tu dois être en mesure de répondre aux mails que 
                je te fournirai, en respectant de manière stricte les consignes à suivre. 
                Ecris moi une réponse pour ce mail, en adoptant un ton [0] et un style d'écriture [1]. 
                Pour répondre a ce mail prends en considération les contextes suivants \n[2]: \n\n"""

prompt = ""

messages = [
    {"role": "user", "content": f"{preprompt} {prompt}"},
]

model = "gpt-3.5-turbo"

responses = []
msg_queue = []

def addParaPrePrompt(ton, style, context):
    """
    This function adds parameters to the global preprompt variable by replacing placeholders with the provided values.
    :param ton: The value to replace the [0] placeholder in preprompt.
    :param style: The value to replace the [1] placeholder in preprompt.
    :param context: The value to replace the [2] placeholder in preprompt.
    """
    global preprompt
    preprompt = preprompt.replace('[0]', ton).replace('[1]', style).replace('[2]', context)


def user_input(input):
    """
    This function processes the user input and performs operations based on the input format.
    :param input: The user input string.
    """
    ton = input.split('XYW2')[1]
    style = input.split('XYW2')[2].split('::')[0]
    context = input.split('WXZYF45')[1].split('::')[0].replace(',', '\n')
    addParaPrePrompt(ton, style, context)
    msg = input.split('::')[1].replace('WXZZ', '?')
    print("prepromt + message" + preprompt, msg)

    msg_queue.append({"role": "user", "content": f"{preprompt} {msg}"})


@app.route('/<input>', methods=['GET', 'POST'])
def index(input):
    """
    This function is the route handler for the '/<input>' endpoint in the Flask application.
    :param input: The input received from the endpoint.
    :return: A JSON response that contains the generated answer from OpenAI API.
    """

    # Thread creation/initialisation
    user_input_thread = Thread(target=user_input, args=(input,))
    user_input_thread.start()
    user_input_thread.join()

    fetch_completion_thread = Thread(target=get_completion_openai)
    fetch_completion_thread.start()
    fetch_completion_thread.join()

    return jsonify(responses[responses.__len__() - 1]['choices'][0]['message']['content'])


def get_completion_openai():
    """
    This function generates a completion using the OpenAI ChatCompletion API.
    """
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
