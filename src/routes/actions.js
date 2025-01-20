import express from 'express';
import Expences from '../models/Expences.js'; 
import Users from '../models/Users.js';

const router = express.Router();

router.get('/users/find-by-email', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ userID: user._id });
  } catch (error) {
    console.error('Error finding user by email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
async function findUserByEmailOrCreate(email, username) {
  try {
      // Try to find the user by email
      let user = await Users.findOne({ email: email });

      // If user not found, create a new one
      if (!user) {
          user = new Users({
              email: email,
              username: username,
              income: 0 
          });

          await user.save(); 
      }

      return user;
  } catch (error) {
      console.error('Error finding or creating user:', error);
      throw error;
  }
}

// Endpoint to register or find a user
router.post('/users/register', async (req, res) => {
  const { email, username } = req.body;

  try {
      const user = await findUserByEmailOrCreate(email, username);

      
      res.status(200).json({ userID: user._id });
  } catch (error) {
      res.status(500).json({ error: 'Failed to register or find user' });
  }
});


router.post('/addexpenses', async (req, res) => {
  const { userID, nameofexpense, spentAt, description } = req.body;
  try {
      const expense = new Expences({ userID, nameofexpense, spentAt, description });
      const savedExpense = await expense.save();
      res.status(201).json(savedExpense);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.put('/users/:userId/addincome',async (req,res) => {
  const { income } = req.body; 
    const { userID } = req.params;

  try{
    const user = await Users.findById(userID);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.income += parseFloat(income);

        const updatedUser = await user.save();

        res.status(200).json({
            message: 'Income updated successfully',
            updatedIncome: updatedUser.income,
        });
    } catch (error) {
        console.error('Error updating income:', error);
        res.status(500).json({ error: 'Failed to update income' });
    }
});




router.get('/expenses/:userID', async (req, res) => {
  try {
      const expenses = await Expences.find({ userID: req.params.userID });
      res.status(200).json(expenses);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});




router.put('/expenses/:expenseID', async (req, res) => {
  const { nameofexpense, spentAt, description } = req.body;
  try {
      // Find the expense by ID and update it
      const updatedExpense = await Expences.findByIdAndUpdate(
          req.params.expenseID,
          { nameofexpense, spentAt, description },
          { new: true } // Return the updated document
      );

      if (!updatedExpense) {
          return res.status(404).json({ message: 'Expense not found' });
      }

      res.status(200).json(updatedExpense);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


router.delete('/expenses/:expenseID', async (req, res) => {
  try {
      const deletedExpense = await Expences.findByIdAndDelete(req.params.expenseID);
      if (deletedExpense) {
          res.status(200).json({ message: 'Expense deleted successfully' });
      } else {
          res.status(404).json({ message: 'Expense not found' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});




export default router;
