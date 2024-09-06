import express from 'express';
import bodyParser from 'body-parser';

interface ActionBase {
    type: string;
    next?: Action;
}

interface SendSMSAction extends ActionBase {
    type: 'sendSMS';
    phoneNumber: string;
}

interface SendEmailAction extends ActionBase {
    type: 'sendEmail';
    from: string;
    to: string;
}

interface ConditionAction extends ActionBase {
    type: 'condition';
    condition: string;
    trueAction: Action;
    falseAction?: Action;
}

interface LoopAction extends ActionBase {
    type: 'loop';
    iterations: number;
    next: Action;
}

type Action = SendSMSAction | SendEmailAction | ConditionAction | LoopAction;

interface DecisionTree {
    root: Action;
}

const executeAction = async (action: Action): Promise<void> => {
    switch (action.type) {
        case 'sendSMS':
            await handleSendSMS(action);
            break;
        case 'sendEmail':
            await handleSendEmail(action);
            break;
        case 'condition':
            await handleCondition(action);
            break;
        case 'loop':
            await handleLoop(action);
            break;
        default:
            throw new Error(`Unknown action type`);
    }

    if (action.next) {
        await executeAction(action.next);
    }
};

const handleSendSMS = async (action: SendSMSAction): Promise<void> => {
    console.log(`Sending SMS to ${action.phoneNumber}`);
};

const handleSendEmail = async (action: SendEmailAction): Promise<void> => {
    console.log(`Sending email from ${action.from} to ${action.to}`);
};

const handleCondition = async (action: ConditionAction): Promise<void> => {
    const conditionResult = eval(action.condition);
    if (conditionResult) {
        console.log("Condition was true, executing trueAction");
        await executeAction(action.trueAction);
    } else {
        console.log("Condition was false, executing falseAction");
        if (action.falseAction)
            await executeAction(action.falseAction);
    }
};

const handleLoop = async (action: LoopAction): Promise<void> => {
    console.log(`Starting loop with ${action.iterations} iterations`);
    for (let i = 0; i < action.iterations; i++) {
        console.log(`Iteration ${i + 1}`);
        await executeAction(action.next);
    }
    console.log("Loop complete");
};

const app = express();
app.use(bodyParser.json());

app.post('/execute', async (req, res) => {
    try {
        const tree: DecisionTree = req.body;
        await executeAction(tree.root);

        console.log('Decision tree executed successfully');
        res.status(200).send(`Decision tree executed successfully.`);
    } catch (error) {
        res.status(500).send(`Error executing decision tree: ${error}`);
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
