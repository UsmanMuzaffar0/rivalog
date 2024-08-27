import React, { createContext, useContext } from "react";
import codePush, { DownloadProgress } from "react-native-code-push";

const CodePushContext = createContext({});

// hookUsage
export const useCodePush = () => useContext(CodePushContext);

export const CodePushProvider = codePush()(
  class extends React.Component {
    state = {
      status: null,
      progress: null,
      operation: null,
    };

    codePushStatusDidChange(status) {
      this.setState({ status });
    }

    syncStatusChangedCallback(syncStatus) {
      this.setState({ operation: syncStatus });
    }

    codePushDownloadDidProgress(progress) {
      this.setState({ progress: progress.receivedBytes / progress.totalBytes });
    }

    render() {
      return (
        <CodePushContext.Provider
          value={{
            status: this.state.status,
            progress: this.state.progress,
          }}
        >
          {this.props.children}
        </CodePushContext.Provider>
      );
    }
  }
);

export default CodePushProvider;
