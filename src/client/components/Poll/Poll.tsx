import * as React from 'react';
import * as PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import formatDate from '../../util/formatDate';
import { AppState } from '../../redux/actions';
import BarChart from '../BarChart/BarChart';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import '../../sass/Poll.scss';
import barChartWidth from '../../util/barChartWidth';

axios.defaults.withCredentials = true;

interface IPollStateProps {
  username:string,
}
interface RouteProps extends RouteComponentProps<{id:string}> {}
type AllProps = RouteProps & IPollStateProps;

interface IPollState {
  poll: {
    name:string,
    question:string,
    options: {[index: string]:number},
    votes:number,
    createdBy:string,
    createdAt:string,
  },
  hasVoted:boolean,
  message:string,
  isLoading:boolean,
  errorMessage:string,
  width:number,
  leftMargin: number,
}

class Poll extends React.Component<AllProps, IPollState> {
  static propTypes: { match: any; history: any; username: PropTypes.Validator<string>; };

  constructor(props:AllProps) {
    super(props);
    this.state = {
      poll: {
        name: '',
        question: '',
        options: {},
        votes: 0,
        createdBy: '',
        createdAt: '',
      },
      hasVoted: false,
      message: '',
      isLoading: true,
      errorMessage: '',
      width: 544,
      leftMargin: 100,
    };
    this.handleVote = this.handleVote.bind(this);
    this.handlePollDeletion = this.handlePollDeletion.bind(this);
    this.setSize = this.setSize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setSize);
    window.addEventListener('orientationchange', this.setSize);
    this.setState({
      width: barChartWidth().w,
      leftMargin: barChartWidth().left,
    });
    const { match } = this.props;
    axios.get(`/api/polls/${match.params.id}`)
      .then((res) => {
        const updatedPoll = res.data.poll;
        this.setState({
          isLoading: false,
        }, () => {
          this.setState({
            poll: { ...updatedPoll },
          });
        });
      });
  }

  setSize(e) {
    const width = barChartWidth().w;
    const leftMargin = barChartWidth().left;
    const { windowW } = barChartWidth();
    // Apparently on mobile devices window emits resize event when browser navigation is hidden
    // so if device width is small, I make it to not change dinamically,
    // and it doesn't need to as it pretty much changes only when orientation does
    if (e.type !== 'orientationchange' && windowW < 480) {
      return;
    }
    this.setState({
      width,
      leftMargin,
    });
  }

  handleVote(e:React.MouseEvent<HTMLButtonElement>) {
    const { hasVoted, poll } = this.state;
    const { match } = this.props;
    const selectedOption = e.currentTarget;
    if (hasVoted) {
      return;
    } // initial dealing with only letting one vote per user
    axios.put(`/api/polls/${match.params.id}`, {
      option: e.currentTarget.dataset.option,
      options: poll.options,
      votes: poll.votes,
    })
      .then((res) => {
        this.setState({
          hasVoted: true,
          message: 'Your vote has been successfully submitted!',
        }, () => {
          this.setState({
            poll: res.data.poll,
          });
          selectedOption.classList.add('btn--selected');
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  handlePollDeletion() {
    const { history, match } = this.props;
    axios.delete(`/api/polls/${match.params.id}`)
      .then(() => {
        history.push('/');
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status} ${error.response.statusText}`,
        });
      });
  }

  render() {
    const { username } = this.props;
    const {
      poll, errorMessage,
      width, leftMargin,
    } = this.state;
    const {
      name, question, options, votes, createdBy, createdAt,
    } = poll;
    const data:{
      optionsList: {option:string, votes:number}[],
      sumVotes:number,
    } = {
      optionsList: Object.keys(options).map((option) => ({ option, votes: options[option] })),
      sumVotes: votes,
    };

    const { message, isLoading } = this.state;
    if (isLoading) {
      return <Loader size="big" />;
    }
    return (
      <div className="poll">
        <div>
          {message && <span className="form__notes--info">{message}</span>}
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </div>
        <h2 className="heading poll__heading">{name}</h2>
        <h3 className="subheading poll__subheading">{question}</h3>
        <div className="poll__section">
          <div className="poll__options">
            {Object.keys(options).map((option) => (
              <div className="poll__option" key={option}>
                <button type="button" data-testid={option} data-option={option} onClick={this.handleVote} className="btn btn--vote">{option}</button>
                {/* <small>{options[option]}</small> */}
              </div>
            ))}
            <p className="poll__votes">{votes}</p>
            {username === createdBy ? <button type="button" onClick={this.handlePollDeletion} className="btn btn--delete">Delete</button> : ''}
          </div>
          <BarChart data={data} width={width} leftMargin={leftMargin} />
        </div>
        <div className="additional poll__additional">
          <p>{`created by ${createdBy}`}</p>
          <p>{`created on ${formatDate(createdAt)}`}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state:AppState) => ({
  username: state.username,
});

export default connect(mapStateToProps)(Poll);
